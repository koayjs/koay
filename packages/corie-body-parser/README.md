# corie-body-parser

[![npm package](https://nodei.co/npm/corie-body-parser.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-body-parser)

> Note: wrap [formidable](https://github.com/felixge/node-formidable) as a middleware for koa2.

> 如果该插件对您的开发有所帮助，请五星好评哦！^_^ ^_^ ^_^

---

## Table of contents

  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)

---

## Installation

```bash
npm install --save corie-body-parser

# or

cnpm install --save corie-body-parser
```

---

## Usage

```javascript

const Koa = require('koa');
const middleware = require('corie-body-parser');

const app = new Koa();
app.use(middleware({
	// ... 参数设置
}));

```

### Options explanation: 
* `encoding`          设置表单字段的编码
* `uploadDir`         设置上传后的文件存放的目录, 默认为: `os.tmpdir()`
* `keepExtensions`    设置上传后的文件是否保持原来的扩展名
* `type`              `multipart` or `urlencoded`
* `maxFieldsSize`     设置提交到后台数据的大小, 默认为: 20MB
* `maxFileSize`       设置上传文件的大小, 默认为: 200MB
* `maxFields`         设置url后面可接收的参数, 默认为: 1000
* `hash`              使用`sha1` or `md5`校验文件

[Go to formidable API](https://github.com/felixge/node-formidable#api)

---

## Examples

### Follow below links to learn more

  - [Simple and Koa](https://github.com/fengxinming/corie/tree/master/examples)
