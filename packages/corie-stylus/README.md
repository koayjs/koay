# corie-stylus

[![npm package](https://nodei.co/npm/corie-stylus.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-stylus)

> Note: wrap [stylus](http://stylus-lang.com/) as a middleware for koa2.

> 如果该插件对您的开发有所帮助，请五星好评哦！^_^ ^_^ ^_^

---

## Table of contents

  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)

---

## Installation

```bash
npm install --save corie-stylus

# or

cnpm install --save corie-stylus
```

---

## Usage

```javascript

const Koa = require('koa');
const middleware = require('corie-stylus');

const app = new Koa();
app.use(middleware({
	// ... 参数设置
}));

```

### Options explanation: 
* `force`      强行每次编译stylus文件
* `src`        设置 .styl 文件的根目录, 拼接网页上的css的相对路径去查找对应的 .styl 文件, 接收一个字符串路径或者一个方法.
* `dest`       设置 .styl 文件被编译之后的根目录, 一般跟静态文件目录保持一直, 接收一个字符串路径或者一个方法.
* `compile`    自定义编译函数.
* `compress`   是否压缩编译后的css文件
* `firebug`    是否使用 FireStylus Firebug 插件输出debug信息
* `linenos`    是否显示行号
* `sourcemap`  是否需要sourcemap
* `includeCSS` 是否支持导入css至 .styl 文件中
* `define`     定义全局变量和方法
* `rawDefine`  扩展stylus底层方法
* `import`     全局导入 .styl 文件到每个 .styl 文件中
* `use`        添加一些常用插件, 比如nib、poststylus等 
* `url`        内置一个全局方法, 调用后可以转换url地址为图片的base64的编码串, 接收一个字符串作为全局方法名称，或者接收一个配置对象
	* `limit`  限制被转码的图片大小, 单位是字节`Byte`
	* `paths`  优先从指定的目录下查找图片
	* `name`   指定方法名称

---

## Examples

### Follow below links to learn more

  - [Simple and Koa](https://github.com/fengxinming/corie/tree/master/examples)
