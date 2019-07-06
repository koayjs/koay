'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');

const mkdirAsync = util.promisify(fs.mkdir);

function warn(...msg) {
  console.log(chalk.yellow(`[${(new Date()).toISOString()}] WARNING`), ...msg);
}

module.exports = async function mkdir(dir, mode) {
  try {
    await mkdirAsync(dir, mode);
  } catch (e) {
    switch (e.code) {
      case 'ENOENT': // 上级目录不存在
        await mkdirAsync(path.dirname(dir), mode);
        await mkdirAsync(dir, mode);
        break;
      case 'EEXIST': // 文件已存在
        warn(e);
        break;
    }
  }
};
