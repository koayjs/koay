'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function warn(...msg) {
  console.log(chalk.yellow(`[${(new Date()).toISOString()}] WARNING`), ...msg);
}

module.exports = function mkdirSync(dir, mode) {
  try {
    fs.mkdirSync(dir, mode);
  } catch (e) {
    switch (e.code) {
      case 'ENOENT': // 上级目录不存在
        mkdirSync(path.dirname(dir), mode);
        mkdirSync(dir, mode);
        break;
      case 'EEXIST': // 文件已存在
        warn(e);
        break;
    }
  }
};
