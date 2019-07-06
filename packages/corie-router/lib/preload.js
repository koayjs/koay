'use strict';

const nativePath = require('path');
const fs = require('fs');

const {
  forEach,
  get,
  isObjectLike,
  isUndefined,
  isString
} = require('lodash');

/**
 * 适配{ key: val } or { key: [ val ] } or { key: { path: '', controller: '' } }
 * @param {String|Array|Object} val
 * @param {String} key
 */
function adaptForRouter(val, key) {
  key = key.split(/\s+/);
  if (typeof val === 'string' || typeof val === 'function' || Array.isArray(val)) {
    val = {
      path: key[0],
      method: key[1],
      controller: val
    };
  } else if (typeof val === 'object') {
    if (!val.path) {
      val.path = key[0];
    }
    if (!val.method) {
      val.method = key[1];
    }
  } else {
    throw new Error(`Problem with route "${key}"`);
  }
  return val;
}

/**
 * 挂载路由
 * @param {Object} json 单条路由规则对应的配置
 * @param {koa-router|express.Router} router 路由挂在对象
 * @param {Object} controllers controller集合
 */
function _preloadRoute(json, router, controllers) {
  let _path = json.path;
  let method = json.method || 'get';
  let controller = json.controller;

  method = router[method] || router[method.toLowerCase()];
  if (!method) {
    throw new Error(`Could not find a method with "${method}" on router`);
  }
  if (!controller) {
    throw new Error(`The controller is empty for route "${_path}"`);
  }
  if (!Array.isArray(controller)) {
    controller = [controller];
  }

  // 将字符串转换为真实的controller函数
  controller = controller.map((n) => {
    let fn = typeof n === 'function' ? n : get(controllers, n);
    if (typeof fn !== 'function') {
      throw new Error(`Could not find "${n}" as controller for route "${_path}"`);
    }
    return fn;
  });

  // 如果配置了path参数，将中间价挂载至该路由下，即：router.get(path, middleware)
  if (_path) {
    controller.unshift(_path);
  }
  if (Array.isArray(controller)) {
    method.apply(router, controller);
  }
};

/**
 * 挂载路由 { key1: val1, key2: val2, key3: {  } }
 * @param {Object|String} json 单条路由规则对应的配置
 * @param {koa-router|express.Router} router 路由挂在对象
 * @param {Object} controllers controller集合
 */
function preloadRoute(json, router, controllers) {
  // 支持 '/router get func' 这种配置
  if (isString(json)) {
    let arr = json.split(/\s+/);
    const obj = {};
    obj.path = arr[0];
    switch (arr.length) {
      case 2:
        obj.controller = arr[1];
        break;
      case 3:
        obj.method = arr[1];
        obj.controller = arr[2];
        break;
    }
    json = obj;
  }
  if (isUndefined(json.path)) {
    forEach(json, (val, key) => _preloadRoute(adaptForRouter(val, key), router, controllers));
  } else {
    _preloadRoute(json, router, controllers);
  }
}

/**
 * 挂在路由集合
 * @param {*} opts
 * @param {koa-router|express.Router} router 路由挂在对象
 * @param {Object} controllers controller集合
 */
function preloadRoutes({
  path,
  exclude = []
}, router, controllers) {
  return (file) => {
    const fileObject = nativePath.parse(file);

    // 只加载js和json
    if (exclude.indexOf(fileObject.name) === -1 && ['.js', '.json'].indexOf(fileObject.ext) > -1) {
      // 路由文件的绝对路径
      file = nativePath.join(path, file);

      // 如果文件存在
      if (fs.existsSync(file)) {
        const json = require(file);
        try {
          // [ { key: value } ] or [ { path: '', controller: '' } ]
          if (Array.isArray(json)) {
            json.forEach((n) => {
              preloadRoute(n, router, controllers);
            });
          } else if (isObjectLike(json)) { // isObject 会判断function
            // 如果配置了对象，就需要转换为数组
            preloadRoute(json, router, controllers);
          }
        } catch (e) {
          e.message = `${e.message} in File: "${file}"`;
          throw e;
        }
      }
    }
  };
}

exports.preloadRoutes = preloadRoutes;
exports.preloadRoute = preloadRoute;
