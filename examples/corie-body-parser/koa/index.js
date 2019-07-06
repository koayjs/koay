'use strict';

const Koa = require('koa');
const middleware = require('../../../packages/corie-body-parser');
const pkg = require('./package.json');

const app = new Koa();

app
  // .use((ctx, next) => {
  //   ctx.request.body = {
  //     key: 1,
  //     bey2: 2
  //   };
  //   return next();
  // })
  .use(middleware())
  .use((ctx, next) => {
    if (ctx.method === 'POST' && ctx.path === '/post') {
      ctx.body = ctx.request.body;
      return;
    }
    return next();
  })
  .use((ctx) => {
    ctx.body = `${JSON.stringify(ctx.request.body)}
    ${JSON.stringify(ctx.request.fields)}
    ${JSON.stringify(ctx.request.files)}`;
  });

app.listen(3500, () => {
  console.log(`${pkg.name} is running at port 3500`);
});
