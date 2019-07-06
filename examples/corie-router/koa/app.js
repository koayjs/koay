'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const CorieRouter = require('../../../packages/corie-router');
const pkg = require('./package.json');

const app = new Koa();
const corieRouter = new CorieRouter(new Router(), {
  controller: {
    path: `./controllers`
  },
  router: {
    path: `./routes`,
    fallback: 'home.js'
  }
}, {
  app // non required
});
const router = corieRouter.getRouter();

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3300, () => {
  console.log(`${pkg.name} is running at port 3300`);
});
