'use strict';

const Koa = require('koa');
const pkg = require('./package.json');
const {
  middleware
} = require('../../../packages/corie-user-agent');

const app = new Koa();

app
  .use(middleware())
  .use((ctx) => {
    ctx.body = ctx.userAgent;
  });

app.listen(3400, () => {
  console.log(`${pkg.name} is running at port 3400`);
});
