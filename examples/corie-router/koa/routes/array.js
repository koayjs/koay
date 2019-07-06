'use strict';

module.exports = [{
  path: '/',
  method: 'get', // 忽略大小写
  controller: 'home.index'
}, {
  path: '/path1',
  method: 'get',
  controller: ['home.debug', 'home.index'] // 多个处理函数
}, {
  path: '/path2', // 默认get请求
  controller: 'home.index'
}, { // 不建议直接写函数
  path: '/path3',
  controller(ctx) {
    ctx.body = `I am path3`;
  }
}, {
  '/path4': 'home.index', // 默认get请求
  '/path5': ['home.index'],
  '/path6': (ctx) => { // 不建议直接写函数
    ctx.body = `I am path6`;
  }
}, '/path17 home.index', '/path18 post home.index'];
