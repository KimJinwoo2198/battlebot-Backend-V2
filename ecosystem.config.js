const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps: [
    {
      name: 'battlebot-backend',
      cwd: '.',
      script: 'yarn',
      args: ['start', '--no-cleanup'],
      env: {
        // You should configure it here.
        NODE_ENV: 'production',
        ...process.env,
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: process.env.DEPLOY_HOST,
      ref: 'origin/main',
      repo: 'https://github.com/Archive-Discord/battlebot-Backend-V2',
      path: process.env.DEPLOY_PRODUCTION_PATH,
      'post-deploy': `yarn && yarn build && pm2 startOrRestart ecosystem.config.js`
    },
  },
};