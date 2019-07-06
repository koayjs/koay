'use strict';

const compatRes = require('koa2-compat-res');

module.exports = function express2koa(fn) {
  return async (ctx, next) => {
    await new Promise((resolve, reject) => fn(ctx.req, compatRes(ctx), err => err ? reject(err) : resolve()));
    await next();
  };
};
