'use strict';

const nativePath = require('path');
const fs = require('fs');
const {
  resolvePathFor
} = require('corie-utils');
const {
  camelCase,
  forOwn,
  remove
} = require('lodash');
const {
  preloadRoutes
} = require('./lib/preload');

class Router {

  /**
   * 构造函数 new Router(arg1, arg2)
   * @param {koa-router|express.Router} router
   * @param {Object} options
   * @param {Object} meta
   */
  constructor(router, options, meta = {}) {
    this._controllers = {};
    this._router = router;

    resolvePathFor(options, ['controller.path', 'router.path']);
    this._handleController(options.controller, meta);
    this._handleRouter(options.router);
  }

  /**
   * 遍历读取controllers目录下的文件
   * @param {Object} ctrlOpts
   * @param {Object} meta
   */
  _handleController(ctrlOpts, meta) {
    // 主要配置信息包括path、exclude
    if (ctrlOpts) {
      const controllers = this._controllers;
      const controlPath = ctrlOpts.path;

      // controller文件集合
      const controls = fs.readdirSync(controlPath) || [];
      const exclude = ctrlOpts.exclude || [];
      controls.forEach((file) => {
        const fileObject = nativePath.parse(file);
        const key = fileObject.name;

        // 有效的js文件
        if (exclude.indexOf(key) === -1 && fileObject.ext === '.js') {
          controllers[camelCase(key)] = require(nativePath.join(controlPath, file));
        }
      });

      meta.controllers = controllers;

      // 分类存储controller，便于传入对象
      forOwn(controllers, (control, key) => {
        if (typeof control === 'function') {
          controllers[key] = control(meta);
        }
      });
    }
  }

  /**
   * 遍历读取routes目录下的文件
   * @param {Object} routerOpts
   */
  _handleRouter(routerOpts) {
    if (routerOpts) {
      const router = this._router;
      const controllers = this._controllers;
      const routerPath = routerOpts.path;

      // 路由目录下的路由配置
      const routes = fs.readdirSync(routerPath) || [];
      const handleRoutes = preloadRoutes(routerOpts, router, controllers);

      // 部分路由需要放在最后加载
      let fallback = routerOpts.fallback;
      if (fallback) {
        if (typeof fallback === 'string') {
          fallback = [fallback];
        }

        // 处理无效的 fallback 文件
        fallback = remove(routes, file => fallback.indexOf(file) > -1);

        // 顺序挂载路由
        routes.forEach(handleRoutes);
        fallback.forEach(handleRoutes);
      } else {
        routes.forEach(handleRoutes);
      }

    }
  }

  /**
   * 获取最开始传入的router对象
   */
  getRouter() {
    return this._router;
  }

  /**
   * 获取controllers集合
   */
  getControllers() {
    return this._controllers;
  }

}

module.exports = Router;
