'use strict';

const EventEmitter = require('events');
const nativePath = require('path');
const http = require('http');
const Koa = require('koa');
const koaMount = require('koa-mount');
const koaCompose = require('koa-compose');
const {
  cloneDeep,
  isObject,
  isString,
  isNumber,
  isFunction,
  isNil
} = require('lodash');

const {
  resolvePathFor
} = require('corie-utils');

class MiddlewareHandler {

  constructor() {
    this.middleware = [];
    this.set = this.use;
  }

  use(name, fn) {
    fn.key = name;
    const {
      middleware
    } = this;
    middleware[middleware.length] = fn;
    return this;
  }

}

class Corie extends EventEmitter {

  constructor(options) {
    super();

    this.options = options;

    // 服务端配置信息
    const {
      server
    } = options;

    // 处理绝对和相对路径，比如：./conf => 工程目录/conf
    resolvePathFor(server, [
      'staticResource.path',
      'view.path',
      'favicon'
    ]);

    // 初始化日志管理类
    const {
      logs
    } = server;
    if (logs) {
      const logFactory = this.logFactory = require('corie-logger');
      logFactory.configure(logs);
    }

    // koa实例
    this.app = new Koa();
  }

  /**
   * 记录http访问日志
   */
  useHttpLogger() {
    const {
      logs,
      httpLogger
    } = this.options.server;
    if (logs && httpLogger && !httpLogger.disabled) {
      const fn = this.logFactory.koaLogger(this.logFactory.getLogger(httpLogger.name), httpLogger.options);
      fn.key = 'httpLogger';
      this.use(fn);
    }
    return this;
  }

  /**
   * 过滤ip
   */
  useIPFilter() {
    const blocked = this.options.server.ipFilter;
    if (blocked && !blocked.disabled) {
      // 请求拦截
      const ipFilter = require('corie-ip-filter');
      const fn = ipFilter(blocked);
      fn.key = 'ipFilter';
      this.use(fn);
    }
    return this;
  }

  /**
   * 简单路由代理转发
   */
  useProxy() {
    const proxy = this.options.server.proxy;
    if (proxy && !proxy.disabled) {
      const proxy = require('koa2-simple-proxy');
      const fn = proxy(proxy.path, proxy.target, proxy.events);
      fn.key = 'proxy';
      this.use(fn);
    }
    return this;
  }

  /**
   * favicon
   */
  useFavicon() {
    const {
      favicon
    } = this.options.server;
    if (favicon) {
      const key = 'favicon';
      let fn = this.getMiddleware(key);
      if (!fn) {
        const koaFavicon = require('koa-favicon');
        fn = koaFavicon(favicon);
        fn.key = key;
        this.use(fn);
      }
    }
    return this;
  }

  /**
   * 解析处理stylus，之后会缓存编译后的css
   */
  useStylus() {
    const stylusOptions = this.options.server.stylus;
    if (stylusOptions && !stylusOptions.disabled) {
      delete stylusOptions.disabled;
      const middleware = require('corie-stylus');
      const fn = middleware(stylusOptions);
      fn.key = 'stylus';
      this.use(fn);
    }
    return this;
  }

  /**
   * 静态资源处理
   */
  useStaticResource() {
    const staticResource = this.options.server.staticResource;
    if (staticResource && !staticResource.disabled) {
      delete staticResource.disabled;
      const {
        favicon,
        path,
        cache,
        prefix,
        options = {}
      } = staticResource;
      // 兼容老代码
      if (favicon !== false) {
        const key = 'favicon';
        let fn = this.getMiddleware(key);
        if (!fn) {
          const koaFavicon = require('koa-favicon');
          fn = koaFavicon(favicon || nativePath.join(path, 'favicon.ico'));
          fn.key = key;
          this.use(fn);
        }
      }

      let fn;
      if (prefix) {
        if (cache) {
          if (!options.prefix) {
            options.prefix = prefix;
          }
          fn = require('koa-static-cache')(path, options);
        } else {
          fn = koaMount(prefix, require('koa-static')(path, options));
        }
      } else {
        const serve = cache ? require('koa-static-cache') : require('koa-static');
        fn = serve(path, options);
      }
      fn.key = 'staticResource';
      this.use(fn);
    }
    return this;
  }

  /**
   * 解析user-agent
   */
  useUserAgent() {
    if (this.options.server.userAgent !== false) {
      const userAgent = require('corie-user-agent');
      const fn = userAgent.middleware();
      fn.key = 'userAgent';
      this.use(fn);
    }
    return this;
  }

  /**
   * 把post数据解析成json格式
   */
  useBodyParser() {
    const bodyParser = this.options.server.bodyParser;
    if (bodyParser && !bodyParser.disabled) {
      delete bodyParser.disabled;
      const bodyparser = require('corie-body-parser');
      const fn = bodyparser(bodyParser);
      fn.key = 'bodyParser';
      this.use(fn);
    }
    return this;
  }

  /**
   * 加载全局locals
   */
  useLocals() {
    const {
      locals
    } = this.options;
    if (locals) {
      const fn = (ctx, next) => {
        Object.assign(ctx.state, cloneDeep(locals));
        return next();
      };
      fn.key = 'locals';
      this.use(fn);
    }
    return this;
  }

  /**
   * 使用模板
   */
  useView() {
    const viewOptions = this.options.server.view;
    if (viewOptions && !viewOptions.disabled) {
      delete viewOptions.disabled;
      const views = require('koa-views');
      const viewsDir = viewOptions.path;
      delete viewOptions.path;
      const fn = views(viewsDir, viewOptions);
      fn.key = 'view';
      this.use(fn);
    }
    return this;
  }

  /**
   * 挂载路由
   */
  useRouter() {
    const {
      server
    } = this.options;
    const {
      controller,
      router
    } = server;

    // 加载routes和controllers
    if (isObject(controller) && isObject(router)) {
      const Router = require('koa-router');
      const CorieRouter = require('corie-router');

      let corieRouter = new CorieRouter(new Router(), server, {
        corie: this
      });
      let router = corieRouter.getRouter();

      // 挂载路由至koa
      const fn = koaCompose([router.routes(), router.allowedMethods()]);
      fn.key = 'router';
      this.use(fn);
    }
    return this;
  }

  /**
   * 使用中间件
   */
  useMiddleware(cb) {
    this
      .useHttpLogger()
      .useIPFilter()
      .useProxy()
      .useFavicon()
      .useStylus()
      .useStaticResource()
      .useUserAgent()
      .useBodyParser()
      .useLocals()
      .useView()
      .useRouter();
    if (isFunction(cb)) {
      const me = this;
      cb(me);
    }
    return this;
  }

  /**
   * 获取日志存储对象实例
   * @param {String} name
   */
  getLogger(name) {
    const { logFactory } = this;
    if (!logFactory) {
      throw new Error('Did not set property "logs" or restart to define "logFactory"');
    }
    return logFactory.getLogger(name);
  }

  /**
   * 启动http服务
   * @param {*} args
   */
  listen(...args) {
    const port = +process.env.PORT || this.options.server.port;
    args.unshift(port);
    this.options.port = port;
    const handleRequest = this.app.callback();
    const beforeHandleRequest = this.options.beforeHandleRequest;
    const server = http.createServer((req, res) => {
      let keeping = beforeHandleRequest && beforeHandleRequest(req, res, this);
      if (keeping !== false) {
        handleRequest(req, res);
      }
    });
    return server.listen(...args);
  }

  /**
   * 使用koa中间件，当传入第一个参数时，根据路由前缀挂在中间件
   * @param {String|Application|Function} path 路由前缀（可选）
   * @param {Application|Function} middleware koa中间件
   */
  use(path, middleware) {
    isString(path) ?
      this.app.use(koaMount(path, middleware)) :
      this.app.use(path);
    return this;
  }

  /**
   * 在指定位置插入中间件
   * @param {Number|String} index 下标或者name
   * @param {Object|Function} middlewares 带名字的中间件
   * @param {Application|Function} fn koa中间件
   */
  insertBefore(key, ...middlewares) {
    const {
      middleware
    } = this.app;
    if (isString(key)) {
      key = middleware.findIndex(n => n.key === key);
      key = key !== -1 ? key : null;
    }
    if (isNumber(key)) {
      let newMiddlewares = [];
      const callback = middlewares[0];
      if (isFunction(callback) && middlewares.length === 1) {
        const handler = new MiddlewareHandler();
        callback(handler);
        newMiddlewares = handler.middleware;
      } else {
        middlewares.forEach((n = []) => {
          const [name, fn] = n;
          if (name && isFunction(fn)) {
            fn.key = name;
            newMiddlewares[newMiddlewares.length] = fn;
          }
        });
      }
      if (newMiddlewares.length) {
        middleware.splice(key, 0, ...newMiddlewares);
      }
    }
    return this;
  }

  /**
   * 在指定位置移除中间件
   * @param {Number|String} index 下标或者name
   */
  remove(key) {
    const {
      middleware
    } = this.app;
    if (isString(key)) {
      key = middleware.findIndex(n => n.key === key);
      key = key !== -1 ? key : null;
    }
    if (isNumber(key)) {
      middleware.splice(key, 1);
    }
    return this;
  }

  /**
   * 获取指定的中间件
   * @param {Number|String} index 下标或者name
   */
  getMiddleware(key) {
    const {
      middleware
    } = this.app;
    if (isNil(key)) {
      return middleware;
    }
    if (isString(key)) {
      key = middleware.findIndex(n => n.key === key);
      key = key !== -1 ? key : null;
    }
    if (isNumber(key)) {
      return middleware[key];
    }
    return null;
  }

}

module.exports = Corie;
