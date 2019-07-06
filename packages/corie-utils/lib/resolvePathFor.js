'use strict';

const {
  get,
  set
} = require('lodash');
const getAbsPath = require('./resolvePath');

/**
 * 给对象的某些属性设置绝对路径
 * @param {Object} options
 * @param {String|Array} src
 */
function resolvePathFor(options, src) {
  if (Array.isArray(src)) {
    src.forEach(dir => resolvePathFor(options, dir));
  } else {
    const relativePath = get(options, src);
    if (Array.isArray(relativePath)) {
      set(options, src, relativePath.map(n => getAbsPath(n)));
    } else {
      const _absPath = getAbsPath(relativePath);
      relativePath !== _absPath && set(options, src, _absPath);
    }
  }
}

module.exports = resolvePathFor;
