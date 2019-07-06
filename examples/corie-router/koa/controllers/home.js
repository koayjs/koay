'use strict';

module.exports = ({
  controllers
}) => {
  const ctrl = {

    index(ctx) {
      ctx.body = `<h1>Hello World</h1><p>${ctx.path}</p><p>${ctx.url}</p>`;
    },

    debug(ctx, next) {
      if (ctx.query.debug === 'true') {
        ctx.throw('Could not debug');
      } else {
        return next();
      }
    }

  };
  return ctrl;
};
