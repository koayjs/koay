# corie-router

[![npm package](https://nodei.co/npm/corie-router.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-router)

> Note: Better configure each route for koa or express

> 如果该插件对您的开发有所帮助，请五星好评哦！^_^ ^_^ ^_^

---

## Table of contents

  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Examples](#examples)

---

## Installation

```bash
npm install --save corie-router

// or

cnpm install --save corie-router
```

---

## Configuration

### There are a few ways to configure your own routes

```

[{
  path: '/',
  method: 'get', // ignore case, GET can be well
  controller: 'home.index'
}]

// Or

[{
  path: '/',
  method: 'get', // post, del, use ...
  controller: ['home.index'] // multiple functions
}]

// Or

{
  // ignore property method
  path: '/',
  controller: 'home.index'
}

// Or

{
  path: '/',
  controller: (ctx) => { // deprecate using a function as controller directly
    ctx.body = 'hello world';
  }
}

// Or

{
  '/': 'home.index',
  '/router get': 'home.index'
}

// Or

{
  '/': {
    controller: 'home.index'
  }
}

// Or

{
  '/': {
    method: 'get',
    path: '/home', // if you wanna use "/home" instead of "/"
    controller: 'home.index'
  }
}

// Or

[
  '/ home.index',
  '/home get home.index'
]

```

---

## Examples

### Follow below links to learn more

  - [Example for koa](examples/koa)
  - [Example for express](examples/express)

### Basic usage for Koa:

```

const Koa = require('koa');
const Router = require('koa-router');
const CorieRouter = require('corie-router');
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

```

<br/>

### Basic usage for Express:

```

const express = require('express');
const CorieRouter = require('corie-router');
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

```
