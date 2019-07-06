'use strict';

const util = require('util');
const Configuration = require('../../packages/corie-configuration');

const config = new Configuration({
  conf: '../corie/conf'
});

console.log('locals ==> ', util.inspect(config.get('locals'), {
  depth: 5
}));
console.log('server ==> ', util.inspect(config.get('server'), {
  depth: 5
}));
console.log('log4js ==> ', util.inspect(config.get('log4js'), {
  depth: 5
}));

const config2 = new Configuration({
  conf: '../corie/conf',
  files: ['locals']
});

console.log('log4js ==> ', util.inspect(config2.get('locals'), {
  depth: 5
}));
