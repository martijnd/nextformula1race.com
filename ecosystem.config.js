module.exports = {
  apps: [
    {
      name: 'nextformula1race',
      script: 'pnpm',
      args: 'start',
      cwd: '/var/www/f1.lekkerklooien.nl/current',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
      error_file: '/var/www/f1.lekkerklooien.nl/logs/err.log',
      out_file: '/var/www/f1.lekkerklooien.nl/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
