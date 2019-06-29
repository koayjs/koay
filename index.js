'use strict';

const http = require('http');
const EventEmitter = require('events');
const onFinished = require('on-finished');
const Koa = require('koa');
const ua = require('koay-ua');
const middleware = require('./lib/middleware');
const extend = require('./lib/extend');
const compose = require('./lib/compose');

class Koay extends EventEmitter {

  constructor(options = {}) {
    super();
    this.options = options;

    // koa实例
    const app = this.app = new Koa();

    // 扩展内部属性
    Object.defineProperties(this, {
      env: {
        enumerable: true,
        set(val) {
          app.env = val;
        },
        get() {
          return app.env;
        }
      },
      middleware: {
        enumerable: true,
        set(val) {
          app.middleware = val;
        },
        get() {
          return app.middleware;
        }
      },
      interceptors: {
        enumerable: true,
        value: []
      }
    });

    extend.middleware(this);
    extend.interceptors(this);

    // 挂载中间件
    middleware(this, options.middleware);
    // 挂载 ua parser
    ua.middleware(app);
  }

  /**
   * 启动http服务
   * @param {...any} args
   */
  listen(...args) {
    let port = +process.env.PORT || this.options.port;
    args.unshift(port);

    const server = http.createServer(this.callback());
    server.on('error', (err) => {
      this.emit('error', err, server);
    });
    server.on('listening', () => {
      this.emit('listening', server);
    });
    return server.listen(...args);
  }

  /**
   * 创建http服务的回调函数
   */
  callback() {
    const handleRequest = this.app.callback();
    return (req, res) => {
      const { interceptors } = this;

      const fn = compose(interceptors);

      // 拦截器执行通过之后才执行koa中间件
      fn(req, res).then(function () {
        return handleRequest(req, res);
      }, function (e) {
        interceptors._emitError(e, req, res);
      });

      onFinished(res, (err) => {
        res.emit('finished', err, req, res);
      });
    };
  }

}

module.exports = Koay;
