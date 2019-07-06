'use strict';

const UserAgent = require('./user-agent');

UserAgent.middleware = () => {

  return (ctx, next) => {
    if (!ctx.userAgent) {
      ctx.userAgent = new UserAgent(ctx.request.headers['user-agent']);
    }
    return next();
  };

};

module.exports = UserAgent;
