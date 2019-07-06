'use strict';

module.exports = ({
  controllers
}) => {
  const ctrl = {};

  ctrl.index = (req, res) => {
    res.send(`<h1>Hello World</h1><p>${req.path}</p><p>${req.url}</p>`);
  };

  ctrl.debug = (req, res, next) => {
    if (req.query.debug === 'true') {
      throw new Error('Could not debug');
    } else {
      return next();
    }
  };

  return ctrl;
};
