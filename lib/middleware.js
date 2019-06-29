'use strict';

const { relative, relativeWith } = require('kyla/path');
const Carrier = require('./Carrier');

/**
 * 处理配置文件
 * @param config {Object} 中间件相关的配置
 */
module.exports = function (koay, {
  favicon,
  stylus,
  staticResource,
  bodyParser,
  view,
  routes,
  controllers
}) {
  const { middleware } = koay;
  const handler = new Carrier();

  // 挂在顶层中间件异常处理
  handler.set('error', (ctx, next) => {
    return next().catch(err => middleware._emitError(err, ctx));
  });

  // 挂载favicon
  if (favicon) {
    handler.set('favicon', require('koa-favicon')(relative(favicon)));
  }

  // 挂载stylus
  if (stylus && !stylus.disabled) {
    delete stylus.disabled;
    handler.set('stylus', require('koay-stylus')(stylus));
  }

  // 挂载静态资源
  if (staticResource && !staticResource.disabled) {
    delete staticResource.disabled;
    relativeWith(staticResource, ['dir']);
    handler.set('staticResource', require('koa-static-cache')(staticResource));
  }

  // 挂载body parser
  if (bodyParser && !bodyParser.disabled) {
    delete bodyParser.disabled;
    handler.set('bodyParser', require('koay-body')(bodyParser));
  }

  // 挂载view
  if (view && !view.disabled) {
    delete view.disabled;
    handler.set('view', require('koa-views')(relative(view.root), view.options));
  }

  // 挂载路由
  if (routes !== false && controllers !== false) {
    const { Controller } = require('koay-router');
    const controller = new Controller({ routes, controllers });
    handler.set('controller', controller.middleware());
  }

  // 导入中间件到koa
  handler.pipe(middleware);
};
