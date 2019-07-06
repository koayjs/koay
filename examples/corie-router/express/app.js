'use strict';

const express = require('express');
const CorieRouter = require('../../../packages/corie-router');
const pkg = require('./package.json');

const app = express();
const corieRouter = new CorieRouter(express.Router(), {
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

app.use(router);

app.listen(3300, () => {
  console.log(`${pkg.name} is running at port 3300`);
});
