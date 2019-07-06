'use strict';

/**
 * 获取项目根路径
 */
function cwd() {
  return (process.cwd && process.cwd()) || __dirname.replace(/\/node_modules\/.*/, '');
}

module.exports = cwd;
