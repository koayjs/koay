'use strict';

module.exports = {
  '/path11': 'home.index', // 默认get请求
  '/path12': ['home.index'],
  '/path13': (ctx) => { // 不建议直接写函数
    ctx.body = `I am path13`;
  },
  '/path16 post': 'home.index'
};
