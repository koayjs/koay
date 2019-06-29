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
      prefix: '',
      buffer: true,
      // 开启 gzip 后每次会走 zipbuffer
      gzip: true,
      dynamic: true,
      preload: true,
      files: new LRU({
        maxAge: 1
      })
    },

    // stylus模板配置
    stylus: {
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
      root: './views',
      options: {
        extension: 'pug',
        pretty: false,
        debug: false,
        compileDebug: false,
        cache: false
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
