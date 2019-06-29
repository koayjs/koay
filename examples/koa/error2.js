'use strict';

const Conf = require('kick-conf');
const Koay = require('../..');

const conf = new Conf({
  dir: './conf'
});

const koay = new Koay(conf.get('server'));

koay.interceptors
  .use(async (req, res, next) => {
    req.user = { name: 'koay' };
    console.log('interceptors 1');
    await next();
    console.log('interceptors 11');
  })
  .use(async (req, res, next) => {
    req.user = { name: 'aaa' };
    console.log('interceptors 2');
    await next();
    console.log('interceptors 22');
  })
  .use((req, res, next) => {
    req.user = { name: 'bbb' };
    console.log('interceptors 3');
    return next();
  });
// .error((err, req, res) => {
//   console.log('yichang', err);
//   res.end('exception');
// });
koay.middleware
  .use((ctx, next) => {
    console.log('中间件');
    ctx.body = ctx.req.user;
    ctx.throw('自定义');
  })
  .error((err, ctx) => {
    ctx.body = err;
    throw err;
  });

console.log(koay.middleware);

koay.app.on('error', (err) => {
  console.log('异常 =>', err);
});

koay.on('listening', () => {
  console.log(`The server is running at port ${koay.options.port}`);
});
koay.listen();
