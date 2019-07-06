'use strict';

const Koa = require('koa');
const middleware = require('../../../packages/corie-ip-filter');
const pkg = require('./package.json');

const app = new Koa();

app
  .use(middleware({
    ua: [/iPhone/i]
  }))
  .use((ctx) => {
    ctx.body = 'hello world';
  });

app.listen(3500, () => {
  console.log(`${pkg.name} is running at port 3500`);
});
