'use strict';

const glob = require('glob');
const {
  difference,
  union
} = require('lodash');

/**
 * 根据表达式匹配具体的路径
 * @param {Array|String} patterns
 */
function matches(patterns) {
  if (!Array.isArray(patterns)) {
    if (typeof patterns === 'string') {
      return patterns.indexOf('!') === 0 ? [] : glob.sync(patterns);
    } else {
      return [];
    }
  }
  let result = [];
  patterns.forEach((pattern) => {
    const exclusion = pattern.indexOf('!') === 0;
    if (exclusion) {
      pattern = pattern.slice(1);
    }
    const arr = glob.sync(pattern);
    if (exclusion) {
      result = difference(result, arr);
    } else {
      result = union(result, arr);
    }
  });
  return result;
}

module.exports = matches;
