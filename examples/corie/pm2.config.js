'use strict';

module.exports = {
  apps: [{
    name: 'corie',
    script: './app.js',

    watch: false,
    instances: 'max',
    instance_var: 'NODE_APP_INSTANCE',
    exec_mode: 'cluster',
    env_test: {
      NODE_ENV: 'test'
    },
    env_production: {
      NODE_ENV: 'production'
    },

    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true

    // kill_timeout: 1600,
    // wait_ready: true, 配置wait_ready后，你需要在服务启动后调用 process.send('ready')
    // listen_timeout: 3000
  }]
};
