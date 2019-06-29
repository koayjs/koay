'use strict';

const { isNumber, isFunction } = require('celia');
const { append, combine } = require('kick-array');

class Carrier {

  constructor() {
    this.middleware = [];
  }

  set(name, fn) {
    if (isFunction(fn)) {
      fn.__name__ = name;
      append(this.middleware, fn);
    }
    return this;
  }

  pipe(arr, start) {
    const { middleware } = this;
    if (isNumber(start)) {
      if (middleware.length) {
        arr.splice(start, 0, ...middleware);
        middleware.length = 0;
      }
    } else {
      combine(arr, middleware);
      middleware.length = 0;
    }
  }

}

module.exports = Carrier;
