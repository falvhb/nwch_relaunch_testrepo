var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
var helpers = require('./lib/helpers');
require('dotenv').load();

module.exports = function() {

  process.env.STATIC_ASSETS = helpers.isProduction()
    ? '/__node__/__static__/client'
    : '/client';

  nodemon({
    script: pkg.main,
    env: {
      'STATIC_ASSETS': process.env.STATIC_ASSETS,
      'DISQUS_API_KEY': process.env.DISQUS_API_KEY
    },
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
