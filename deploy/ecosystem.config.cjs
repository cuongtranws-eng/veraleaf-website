// PM2 process file for running VeraLeaf on a VPS without Docker.
//   npm i -g pm2
//   pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'veraleaf',
      cwd: __dirname + '/..',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
      env: { NODE_ENV: 'production', NODE_OPTIONS: '--no-deprecation' },
      instances: 1, // keep 1: the contact rate limiter and Payload run in-process
      autorestart: true,
      max_memory_restart: '900M',
      time: true,
    },
  ],
};
