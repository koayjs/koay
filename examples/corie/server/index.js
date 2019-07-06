'use strict';

const Corie = require('../../../packages/corie');
const Config = require('corie-configuration');

// 环境变量
const env = process.env.NODE_ENV || 'development';
const config = new Config({
  env,
  conf: './conf'
});

const corie = new Corie({
  // 服务相关配置
  server: config.get('server'),
  // pug模板需要的全局静态值
  locals: config.get('locals'),
  beforeHandleRequest(req, res) {
    console.log('===>>', req.url);
  }
});

// 加载中间件
corie.useMiddleware();
corie.insertBefore(1, (handler) => {
  handler.set('hello', (ctx, next) => {
    console.log('hello world');
    return next();
  });
});
corie.insertBefore(2, (handler) => {
  handler
    .set('hello2', (ctx, next) => {
      console.log('hello world2');
      return next();
    })
    .set('hello4', (ctx, next) => {
      console.log('hello world4');
      return next();
    });
});
corie.insertBefore('hello', [
  'hello3',
  (ctx, next) => {
    console.log('hello world3');
    return next();
  }
]);
// console.log(corie.app.middleware);
module.exports = corie;
