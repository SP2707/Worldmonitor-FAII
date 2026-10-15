// Headless run with automatic restart:  npm i -g pm2   then   pm2 start ecosystem.config.cjs
//   pm2 logs worldmonitor-faii     pm2 status     pm2 stop worldmonitor-faii
// start-with-local-redis.mjs exits when the server exits, so PM2 restarts the whole stack (Redis stand-in,
// server, seed runner). No max_memory_restart: PM2 would only measure this wrapper, not the server child.
module.exports = {
  apps: [{
    name: 'worldmonitor-faii',
    script: 'scripts/start-with-local-redis.mjs',
    autorestart: true,
    exp_backoff_restart_delay: 1000,
    kill_timeout: 15000,
    time: true,
    merge_logs: true,
    out_file: 'logs/server.log',
    error_file: 'logs/server.log',
  }],
};
