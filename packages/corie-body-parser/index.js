'use strict';

const formidable = require('formidable');

module.exports = function (opt) {
  return function (ctx, next) {
    if (ctx.request.body !== undefined) {
      return next();
    }
    if (ctx.disableBodyParser) {
      return next();
    }
    const form = new formidable.IncomingForm();
    if (opt && typeof opt === 'object') {
      Object.keys(opt).forEach((key) => {
        form[key] = opt[key];
      });
    }
    return (new Promise((resolve, reject) => {
      const body = {};
      const fields = {};
      const files = {};
      form
        .on('field', (name, value) => {
          if (!body[name]) {
            body[name] = value;
          }
          let tmpField = fields[name];
          if (!tmpField) {
            tmpField = fields[name] = [];
          }
          tmpField.push(value);
        })
        .on('file', (name, file) => {
          let tmpFile = files[name];
          if (!tmpFile) {
            tmpFile = files[name] = [];
          }
          tmpFile.push(file);
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          ctx.request.body = body;
          ctx.request.fields = fields;
          ctx.request.files = files;
          resolve();
        })
        .parse(ctx.req);
    })).then(() => next());
  };
};
