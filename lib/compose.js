'use strict';

const { isAsyncFunction } = require('celia');

function callbackify(fn) {
  return isAsyncFunction(fn) ?
    function mw(req, res, next) {
      fn(req, res, next).catch(function (err) {
        return next(err);
      });
    } :
    fn;
};

function compose(middleware) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('Middleware stack must be an array!');
  }
  for (const fn of middleware) {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be composed of functions!');
    }
  }

  // 异步函数转换
  middleware = middleware.map(function (mw) {
    return callbackify(mw);
  });

  return function (req, res) {
    let index = -1;

    function dispatch(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }

      index = i;
      let fn = middleware[i];
      if (fn) {
        return (function (index) {
          return new Promise(function (resolve, reject) {
            try {
              Promise
                .resolve(fn(req, res, function () {
                  dispatch(index)
                    .then(resolve)
                    .catch(reject);
                }))
                .catch(reject);
            } catch (e) {
              reject(e);
            }
          });
        })(i + 1);
      } else {
        return Promise.resolve();
      }
    }

    return dispatch(0);
  };
}

module.exports = compose;
