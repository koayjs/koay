'use strict';

const LruCache = require('lru-cache');

module.exports = {
  staticResource: {
    // 是否缓存静态资源
    cache: true,
    options: {
      buffer: true,
      // 开启 gzip 后每次会走 zipbuffer
      gzip: true,
      dynamic: true,
      preload: false,
      files: new LruCache({
        max: 20,
        length: () => 1,
        maxAge: 1000 * 60 * 60 * 24
      })
    }
  }
};
