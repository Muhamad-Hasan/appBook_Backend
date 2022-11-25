module.exports = {
  apps : [{
    name: 'Booking App',
    script: './bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5013,
      CONNECTION_STRING: 'mongodb+srv://test:1234$abc@cluster0.xtyeu.gcp.mongodb.net/appbook?retryWrites=true&w=majority',
      EMAIL_CONFIG_PASSWORD: 'BKBcsQjuizlDCYtWHcTuKRmbmc92PGcizLAm5fwJlXND',
      EMAIL_CONFIG_USER: 'AKIAWN7ANJOK7RMMJ2PY',
      FORGET_EMAIL_LINK: 'http://a.com?id=',
      JWT_SECRET_KEY: 'AppBook',
      Token_Expiry_Time:'1d',
      // STRIPE_SECRET_KEY:'sk_test_51I0lW6GUTQA59BvJ4rAFX4VNB9j8emp4FYAKYYiHtCLa96Q8Lj8sm4pjeIZKqOAEDAT21fo8DOjsObNEkCSW1k6R007ttH4s14',
      // PUBLISH_KEY: 'pk_test_51I0lW6GUTQA59BvJ0OBmLxv5yBWrkLqhleaJpDSoDtXNmW6IqcacQ8DX0UlnzCsHE22n3aGro54TgYjGVdGLk4yw00WgGoTsf5'

    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};


