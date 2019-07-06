'use strict';

const fs = require('fs');
const path = require('path');
const {
  merge
} = require('lodash');
const corieUtils = require('corie-utils');

class Configuration {

  constructor(options) {
    const {
      conf,
      files,
      filter,
      extnames = ['.js', '.json']
    } = options;
    if (!conf) {
      throw new Error('Please set a non-null value for confPath');
    }
    const confPath = corieUtils.resolvePath(conf);
    const env = options.env || 'development';
    const defaults = this._defaults = {};
    let dirs = fs.readdirSync(confPath);
    if (files && Array.isArray(files)) {
      dirs = dirs.filter(n => files.includes(n));
    }
    if (typeof filter === 'function') {
      dirs = dirs.filter(filter);
    }
    dirs.forEach((dir) => {
      // 每个文件夹中的配置文件作为一组配置信息
      const eachConfPath = path.resolve(confPath, dir);
      // 检查当前目录的状态
      const stats = fs.statSync(eachConfPath);
      if (stats.isDirectory()) {
        let confInfo = {};
        // index.js 为公用配置
        const indexFile = path.join(eachConfPath, 'index.js');
        if (fs.existsSync(indexFile)) {
          confInfo = require(indexFile);
        }
        // 根据env查找文件
        const envFile = path.join(eachConfPath, `${env}.js`);
        if (fs.existsSync(envFile)) {
          confInfo = merge(confInfo, require(envFile));
        }
        defaults[dir] = confInfo;
      } else if (extnames && extnames.length && stats.isFile()) {
        const {
          ext,
          name,
          base
        } = path.parse(eachConfPath);
        if (extnames.indexOf(ext) > -1) {
          if (!defaults[name]) {
            defaults[name] = require(eachConfPath);
          } else {
            defaults[base] = require(eachConfPath);
          }
        }
      }
    });
  }

  /**
   * 获取conf目录下的配置信息
   * @param {String} name
   */
  get(name) {
    return name ? this._defaults[name] : this._defaults;
  }

}

module.exports = Configuration;
