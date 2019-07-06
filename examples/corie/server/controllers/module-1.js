'use strict';

module.exports = ({
  controllers
}) => {

  return {

    func1(ctx) {
      return ctx.render('index', {
        desc: 'module 1'
      });
    },

    accept(ctx) {
      console.log(ctx.url);
      console.log(ctx.request.body);
    }

  };

};
