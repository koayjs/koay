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
    console.log(req.url, 'interceptors 1');
    // console.log(next);
    next().then(() => {
      console.log(req.url, 'interceptors 11');
    });
  })
  .use((req, res, next) => {
    req.user = { name: 'aaa' };
    console.log(req.url, 'interceptors 2');
    throw new Error('自定义异常');
    // await next();
    // console.log('interceptors 22');
  })
  .use((req, res, next) => {
    req.user = { name: 'bbb' };
    console.log(req.url, 'interceptors 3');
    return next();
  })
  .error((err, req, res) => {
    console.log(req.url, 'yichang', err);
    res.end('exception');
  });
koay.middleware
  .use((ctx, next) => {
    console.log(ctx.url, '中间件');
    ctx.body = ctx.req.user;
    // ctx.throw('自定义');
  });
// .error(async (err, ctx) => {
//   ctx.body = err;
//   // throw err;
// });

console.log(koay.middleware);

koay.on('error', (err) => {
  console.log('异常 =>', err);
});

koay.on('listening', () => {
  console.log(`The server is running at port ${koay.options.port}`);
});
koay.listen();
