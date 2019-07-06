# corie-user-agent

[![npm package](https://nodei.co/npm/corie-user-agent.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-user-agent)

> Note: parse user agent

```bash
npm install --save corie-user-agent
```

```javascript
// for browsers

const UserAgent = require('corie-user-agent');

const userAgent = new UserAgent(navigator.userAgent);

console.log(userAgent);

// for Koa2

const {
  middleware
} = require('corie-user-agent');

const app = new Koa();

app
  .use(middleware())
  .use((ctx) => {
    ctx.body = ctx.userAgent;
  });

```

[Examples](https://github.com/fengxinming/corie/tree/master/examples/corie-user-agent/koa)
