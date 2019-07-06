'use strict';

const LruCache = require('lru-cache');

module.exports = {

  // 服务启动后监听的端口
  port: 9001,

  favicon: './public/favicon.ico',

  // 静态资源
  staticResource: {
    // 对该路由前缀拦截并返回静态资源文件
    // prefix: '/static',
    prefix: '',
    // 静态文件存放的目录
    path: './public',
    // 配置favicon图标，''或者null表示默认引用path目录下的favicon.ico
    favicon: false,
    // 是否缓存静态资源
    cache: true,
    options: {
      buffer: true,
      // 开启 gzip 后每次会走 zipbuffer
      gzip: true,
      dynamic: true,
      preload: true,
      files: new LruCache({
        max: 500,
        length(n, key) {
          return n * 2 + key.length;
        },
        dispose(key, n) {
          n.close();
        },
        maxAge: 1000 * 60 * 60 * 24
      })
    }
  },

  // 日志初始化配置，可以设置文件路径或者json对象
  logs: './conf/log4js.json',

  httpLogger: {
    disabled: true,
    name: 'http',
    options: {
      level: 'auto',
      format(req, res, next) {
        const obj = {
          'user-agent': ':user-agent',
          'remote-addr': ':remote-addr',
          method: ':method',
          url: ':url',
          status: ':status',
          'response-time': ':response-timems',
          'content-length': ':content-lengthbyte',
          'http-version': 'HTTP/:http-version',
          referrer: ':referrer'
        };
        return next(JSON.stringify(obj));
      }
    }
  },

  // stylus模板配置
  stylus: {
    // 公网环境禁用stylus插件
    disabled: true,
    // 在stylus文件中定义全局常量
    define: {
      '$CDN_PATH': ''
    },
    // 扩展常用中间件
    use: [
      require('nib')(),
      require('poststylus')(['autoprefixer', 'rucksack-css'])
    ],
    // 全局导入公共函数
    import: [
      '~nib/lib/nib/index.styl',
      './client/css/utils/**/*.styl'
    ],
    // 在stylus文件中内置一个处理图片的便捷函数
    url: {
      name: 'inline-url',
      limit: 50000,
      paths: ['./public']
    },
    // stylus文件地址
    src: './client',
    // 编译后生成的地址
    dest: './public'
  },

  // node加载的模板
  view: {
    path: './server/views',
    extension: 'pug',
    options: {
      pretty: false,
      debug: false,
      compileDebug: false,
      cache: true
    }
  },

  // 把post数据转换成json
  bodyParser: {},

  // 路由控制器
  controller: {
    path: './server/controllers'
  },

  // 路由相关配置
  router: {
    path: './server/routes',
    fallback: 'home.js'
  }
};
