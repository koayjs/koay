'use strict';

const chalk = require('chalk');

const pkg = require('./package.json');

const corie = require('./server');
// 启动服务
const server = corie.listen();

const appLog = corie.getLogger('app');
// 监听异常
server.on('error', (error) => {
  appLog.error('服务器异常：', error);
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      appLog.error(`Port ${error.port} requires elevated privileges`);
      setTimeout(process.exit, 1000, 1);
      break;
    case 'EADDRINUSE':
      appLog.error(`Port ${error.port} is already in use`);
      setTimeout(process.exit, 1000, 1);
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  const addr = server.address();
  const message = `> ${pkg.name} is running at ${typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port}`;
  appLog.info(message);
  if (process.env.NODE_ENV === 'development') {
    console.info(chalk.green(message));
  }
});
process.on('SIGINT', () => {
  appLog.info('SIGINT signal received.');

  // 关闭连接
  server.close((err) => {
    // 异常结束进程
    if (err) {
      appLog.error(err);
      process.exit(1);
    }

    // 其它连接关闭
    process.exit(0);
  });
});
