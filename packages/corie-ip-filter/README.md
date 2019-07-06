# corie-ip-filter

[![npm package](https://nodei.co/npm/corie-ip-filter.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-ip-filter)

> Note: http request filter

```bash
npm install --save corie-ip-filter
```

```javascript
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


```

[Examples](https://github.com/fengxinming/corie/tree/master/examples/corie-ip-filter/koa)
