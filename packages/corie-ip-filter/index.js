'use strict';

const {
  merge
} = require('lodash');

// 默认参数
const defaults = {
  ua: [ // 阻止请求
    // /curl/i,
    /Baiduspider/i
  ]
};

module.exports = (options) => {
  options = merge({}, defaults, options);
  const logger = options.logger || console;

  return (ctx, next) => {
    const source = ctx.get('user-agent') || '';
    const match = (options.ua || []).some(ua => ua.test(source));

    // 防百度爬虫
    if (match) {
      ctx.status = 403;
      ctx.message = 'Access is denied';
    } else {
      const _ip = ctx.ip;
      let pass = false;
      let nolist = true;

      // 过滤白名单
      if (options.whitelist && Array.isArray(options.whitelist)) {
        nolist = false;
        pass = options.whitelist.some((item) => {
          return RegExp(item).test(_ip);
        });
      } else {
        pass = true;
        nolist = true;
      }

      // 过滤黑名单
      if (options.blacklist && Array.isArray(options.blacklist)) {
        nolist = false;
        pass = !options.whitelist.some((item) => {
          return RegExp(item).test(_ip);
        });
      } else {
        if (nolist) {
          pass = true;
        }
        nolist = true;
      }

      if (pass) {
        logger.info(`${(new Date()).toUTCString()} ${_ip} -> ✓`);
        return next();
      } else {
        logger.info(`${(new Date()).toUTCString()} ${_ip} -> ×`);
      }
    }
  };

};
