'use strict';

const nativePath = require('path');
const stylus = require('stylus');
const {
  isString,
  isBoolean,
  forOwn
} = require('lodash');
const {
  express2koa,
  resolvePathFor
} = require('corie-utils');

const moduleRequestRegex = /^[^?]*~/;
const currentDir = process.cwd();

module.exports = (stylusOptions) => {
  // 处理成绝对路径
  resolvePathFor(stylusOptions, [
    'src',
    'dest',
    'import',
    'url.paths'
  ]);

  // 默认一个编译函数
  if (!stylusOptions.compile) {
    stylusOptions.compile = (str, path) => {
      // 编译后css的路径
      const newStylus = stylus(str).set('filename', path);
      if (stylusOptions.sourcemap) {
        if (isBoolean(stylusOptions.sourcemap)) {
          stylusOptions.sourcemap = {};
        }
        stylusOptions.sourcemap.inline = true;
      }

      newStylus
        .set('compress', stylusOptions.compress)
        .set('firebug', stylusOptions.firebug)
        .set('linenos', stylusOptions.linenos)
        .set('sourcemap', stylusOptions.sourcemap);

      // 内置url函数至stylus文件中
      const inlineUrl = stylusOptions.url;
      if (inlineUrl) {
        if (isString(inlineUrl)) {
          newStylus.define(inlineUrl, stylus.url());
        } else {
          inlineUrl.limit = inlineUrl.limit || 30000;
          inlineUrl.paths = inlineUrl.paths || [];
          newStylus.define(inlineUrl.name || 'inline-url', stylus.url(inlineUrl));
        }
      }

      // 默认支持导入css
      if (stylusOptions.includeCSS !== false) {
        newStylus.set('include css', true);
      }

      // 支持全局变量和全局函数
      const defineObj = (stylusOptions.define || {});
      forOwn(defineObj, (val, key) => newStylus.define(key, val));

      // 定义stylus的原生函数
      const rawDefineObj = (stylusOptions.rawDefine || {});
      forOwn(rawDefineObj, (val, key) => newStylus.define(key, val, true));

      // 导入styl文件后，全局可访问styl里面的东西
      if (Array.isArray(stylusOptions.import)) {
        stylusOptions.import.forEach((plugin) => {
          if (moduleRequestRegex.test(plugin)) {
            plugin = plugin.replace(moduleRequestRegex, nativePath.join(currentDir, '/node_modules/'));
          }
          newStylus.import(plugin);
        });
      }

      // 导入一些插件库nib或者poststylus等
      if (Array.isArray(stylusOptions.use)) {
        stylusOptions.use.forEach((plugin) => {
          newStylus.use(plugin);
        });
      }
      return newStylus;
    };
  }

  return express2koa(stylus.middleware(stylusOptions));
};
