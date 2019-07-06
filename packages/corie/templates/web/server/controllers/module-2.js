'use strict';

module.exports = ({
  controllers
}) => {

  return {

    func1(ctx) {
      return ctx.render('index', {
        desc: 'module 2'
      });
    }

  };

};