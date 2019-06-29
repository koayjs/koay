'use strict';

const Conf = require('kick-conf');
const Koay = require('../../');

const conf = new Conf({
  dir: './conf'
});

const koay = new Koay(conf.get('server'));

koay.interceptors
  .use(async (req, res, next) => {
    req.user = { name: 'koay' };
    console.log(req.url, 'interceptors 1 ================');
    await next();
    console.log('interceptors 11');
  })
  .use(async (req, res, next) => {
    req.user = { name: 'aaa' };
    console.log('interceptors 2');
    next().then(() => {
      console.log('interceptors 22');
    });
  })
  .use((req, res, next) => {
    req.user = { name: 'bbb' };
    console.log('interceptors 3');
    return next();
  });

koay.middleware
  .use((ctx, next) => {
    console.log(ctx.url, ctx.parseUserAgent(ctx.headers['user-agent']));
    console.log('中间件');
    ctx.body = ctx.req.user;
  });

console.log(koay.middleware);

koay.on('listening', () => {
  console.log(`The server is running at port ${koay.options.port}`);
});
koay.listen();
