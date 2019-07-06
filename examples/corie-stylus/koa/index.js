'use strict';

const path = require('path');
const Koa = require('koa');
const koaStatic = require('koa-static');
const middleware = require('../../../packages/corie-stylus');

const app = new Koa();
app.use(middleware({
  // 在stylus文件中定义全局常量
  define: {
    '$CDN_PATH': ''
  },
  // 扩展常用中间件
  use: [
    require('nib')(),
    require('poststylus')(['autoprefixer', 'rucksack-css'])
  ],
  // 全局导入公共函数
  import: [
    '~nib/lib/nib/index.styl',
    './client/css/utils/**/*.styl'
  ],
  // 在stylus文件中内置一个处理图片的便捷函数
  url: {
    name: 'inline-url',
    limit: 50000,
    paths: ['./public']
  },
  // stylus文件地址
  src: './client',
  // 编译后生成的地址
  dest: './public'
}));
app.use(koaStatic(path.join(__dirname, 'public')));
app.use((ctx) => {
  const html = `<!doctype html>
  <html>
    <head>
      <link rel="stylesheet" href="/css/index.css">
    </head>
    <body>
      <h1>hello world</h1>
    </body>
  </html>`;
  ctx.body = html;
});
const server = app.listen(3500);
server.on('listening', () => {
  console.log('The sever is running at port 3500');
});
