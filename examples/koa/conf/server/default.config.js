'use strict';

const LRU = require('lru-cache');

module.exports = {

  // 服务启动后监听的端口
  port: 8001,

  middleware: {
    favicon: './public/favicon.ico',

    // 静态资源
    staticResource: {
      dir: './public',
      prefix: '/static',
      buffer: true,
      // 开启 gzip 后每次会走 zipbuffer
      gzip: true,
      dynamic: true,
      preload: true,
      files: new LRU({
        max: 1000
      })
    },

    // node加载的模板
    view: {
      root: './views',
      options: {
        extension: 'pug',
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
  }

};
