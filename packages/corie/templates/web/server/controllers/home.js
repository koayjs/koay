'use strict';

module.exports = ({
  controllers
}) => {
  return {

    index(ctx) {
      return ctx.render('index', {
        desc: 'index'
      });
    }

  };
};
