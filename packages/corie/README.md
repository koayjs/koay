# Corie

[![npm package](https://nodei.co/npm/corie.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie)

> Born to build better suitable frameworks and apps with Node.js & Koa

## Table of contents

  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)


## Installation

```bash
npm i --save corie corie-configuration
```

## Usage
```javascript
'use strict';

const Corie = require('corie');
const Config = require('corie-configuration');

// 环境变量
const env = process.env.NODE_ENV || 'development';
const config = new Config({
  env,
  conf: './conf'
});

const corie = new Corie({
  // 服务相关配置
  server: config.get('server'),
  // pug模板需要的全局静态值
  locals: config.get('locals')
});

// 加载中间件
corie.useMiddleware();

module.exports = corie;

```

## Examples

### Follow below links to learn more

  - [Simple and Koa](https://github.com/fengxinming/corie/tree/master/examples)
