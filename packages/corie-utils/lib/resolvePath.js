'use strict';

const nativePath = require('path');
const {
  isString
} = require('lodash');
const currentWorkDir = require('./cwd')();

/**
 * 根据相对地址获取绝对路径
 * @param {String} _path
 * @param {String} relativePath
 */
function resolvePath(_path, relativePath = currentWorkDir) {
  if (!isString(_path) || _path.startsWith('~')) {
    return _path;
  }
  const file = nativePath.relative(relativePath, _path);
  return nativePath.join(relativePath, file);
}

module.exports = resolvePath;
