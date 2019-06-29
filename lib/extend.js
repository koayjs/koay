'use strict';

const finalhandler = require('finalhandler');
const koaMount = require('koa-mount');
const { isString, isNumber, isNil, isFunction } = require('celia');
const MiddlewareHandler = require('./Carrier');

exports.middleware = function (koay) {
  const { app, middleware: arr } = koay;

  function ctxhandler(e, ctx) {
    // 设置状态码
    ctx.status = e.status || 500;
    // 触发异常事件
    koay.app.emit('error', e, ctx);
    // 如果处理了异常
    const { status } = ctx;
    if ((status >= 200 && status < 300) || status === 304) {
      return;
    }
    // 判断是否已下发响应流
    if (!ctx.headerSent && ctx.writable) {
      ctx.respond = false;
      finalhandler(ctx.req, ctx.res)(e);
    }
  }

  Object.defineProperties(arr, {
    use: {
      /**
       * 使用koa中间件，当传入第一个参数时，根据路由前缀挂在中间件
       * @param {String|Application|Function} path 路由前缀（可选）
       * @param {Application|Function} middleware koa中间件
       */
      value(path, middleware) {
        const fn = isString(path) ? koaMount(path, middleware) : path;
        // fn.__name__ = arr.length;
        app.use(fn);
        return this;
      }
    },

    findIndexByName: {
      /**
       * 根据name查找下标
       * @param {String} name
       */
      value(name) {
        if (isString(name)) {
          name = this.findIndex(n => n.__name__ === name);
        }
        return name;
      }
    },

    insertBefore: {
      /**
       * 在指定位置插入中间件
       * @param {Number|String} index 下标或者name
       * @param {Function} fn koa中间件
       */
      value(index, fn) {
        if (isFunction(fn)) {
          index = this.findIndexByName(index);
          if (isNumber(index)) {
            const handler = new MiddlewareHandler();
            fn(handler);
            handler.pipe(this, index);
          }
        }
        return this;
      }
    },

    remove: {
      /**
       * 在指定位置移除中间件
       * @param {Number|String} index 下标或者name
       */
      value(index) {
        return this.replace(index);
      }
    },

    replace: {
      /**
       * 在指定位置移除中间件
       * @param {Number|String} index 下标或者name
       * @param {Function} fn koa中间件
       */
      value(index, fn) {
        index = this.findIndexByName(index);
        if (isNumber(index)) {
          fn ?
            this.splice(index, 1, fn) :
            this.splice(index, 1);
        }
        return this;
      }
    },

    get: {
      /**
       * 获取指定的中间件
       * @param {Number|String} index 下标或者name
       */
      value(index) {
        if (isNil(index)) {
          return this;
        }
        index = this.findIndexByName(index);
        if (isNumber(index)) {
          return index < 0 ? this[index + this.length] : this[index];
        }
        return null;
      }
    },

    error: {
      /**
       * 传入异常捕获函数
       * @param {Function} fn 回调方法
       */
      value(fn) {
        this.onerror = fn || ctxhandler;
        return this;
      }
    },

    _emitError: {
      /**
       * 处理error异常
       * @param {Function|Object} err 回调方法
       * @param {Object} ctx 上下文
       */
      value(err, ctx) {
        const { onerror } = this;
        // 捕捉onerror抛出来的异常
        try {
          return Promise
            .resolve(onerror(err, ctx))
            .catch((e) => {
              ctxhandler(e, ctx);
            });
        } catch (e) {
          ctxhandler(e, ctx);
        }
      }
    }
  });

  // 默认异常处理函数
  arr.error();
};

exports.interceptors = function (koay) {
  const { interceptors } = koay;

  function reshandler(e, req, res) {
    // 设置状态码
    res.statusCode = e.status || 500;
    // 触发异常事件
    koay.emit('error', e, req, res);
    // 如果处理了异常
    const { statusCode } = res;
    if ((statusCode >= 200 && statusCode < 300) || statusCode === 304) {
      return;
    }
    // 判断是否已下发响应流
    if (!res.headersSent &&
      (!res.finished &&
        (!res.socket || res.socket.writable))) {
      finalhandler(req, res)(e);
    }
  }

  Object.defineProperties(interceptors, {
    use: {
      /**
       * 添加拦截器
       * @param {Function} fn 回调方法
       */
      value(fn) {
        if (isFunction(fn)) {
          this[this.length] = fn;
        }
        return this;
      }
    },

    error: {
      /**
       * 传入异常捕获函数
       * @param {Function} fn 回调方法
       */
      value(fn) {
        this.onerror = fn || reshandler;
        return this;
      }
    },

    _emitError: {
      /**
        * 处理error异常
        * @param {Error} err
        * @param {http.IncomingMessage} req
        * @param {http.ServerResponse} res
        */
      value(err, req, res) {
        const { onerror } = this;
        // 捕捉onerror抛出来的异常
        try {
          return Promise
            .resolve(onerror(err, req, res))
            .catch((e) => {
              reshandler(e, req, res);
            });
        } catch (e) {
          reshandler(e, req, res);
        }
      }
    }
  });

  // 默认异常处理函数
  interceptors.error();
};
