module.exports = {
  apps: [
    {
      name: 'apple-blog',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/apple-blog',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        JWT_SECRET: 'change-this-to-a-random-string-64-chars',
      },
      // 自动重启配置
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      // 日志
      error_file: '/var/www/apple-blog/logs/err.log',
      out_file: '/var/www/apple-blog/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
