'use strict';

module.exports = {
  '/path11': 'home.index', // 默认get请求
  '/path12': ['home.index'],
  '/path13': (req, res) => { // 不建议直接写函数
    res.send(`I am path13`);
  },
  '/path16 post': 'home.index'
};
