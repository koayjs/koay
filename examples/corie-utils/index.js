'use strict';

const {
  cwd,
  express2koa,
  matches,
  mkdir,
  mkdirSync,
  resolvePath,
  resolvePathFor
} = require('../../packages/corie-utils');

console.log('cwd', cwd());

// =================

const express = (req, res, next) => {
  console.log('I am express');
  next();
};
const koa = express2koa(express);
koa({
  req: {},
  res: {}
}, () => {
  console.log('Finish');
});

// ==================

console.log('matches', matches(`${cwd()}/../**/*.js`));
console.log('matches', matches(`!${cwd()}/../**/*.js`));
console.log('matches', matches([`${cwd()}/../**/*.js`, `!${cwd()}/../node_modules/**/*.js`]));

// ===================

mkdir('./abc/def');

// ===================

mkdirSync('./ghi/jkl');

// ===================

console.log('resolvePath', resolvePath('./path.js'), resolvePath('../path.js'));

const obj = {
  path1: './path.js',
  path2: './index.js'
};

const obj2 = {
  path1: './path.js',
  path2: `${__dirname}/func.js`,
  path3: [
    '~nib/lib/nib/index.styl',
    './client/css/utils/**/*.styl'
  ]
};

// ===================

resolvePathFor(obj, 'path2');
console.log('resolvePathFor', obj);
resolvePathFor(obj2, ['path1', 'path2', 'path3']);
console.log('resolvePathFor', obj2);
