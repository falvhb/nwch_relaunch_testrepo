var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
var helpers = require('./lib/helpers');

var envPath = helpers.isProduction() ? '.env' : '.env.dev';
require('dotenv').load({
  path: envPath
});

module.exports = function() {
  nodemon({
    script: pkg.main,
    env: {
      'STATIC_ASSETS': process.env.STATIC_ASSETS,
      'DISQUS_SHORTNAME': process.env.DISQUS_SHORTNAME,
      'KALTURA_ACCOUNT_ID': process.env.KALTURA_ACCOUNT_ID,
      'KALTURA_PLAYER_ID': process.env.KALTURA_PLAYER_ID,
      'KALTURA_PLAYER_NOADS_ID': process.env.KALTURA_PLAYER_NOADS_ID,
      'KALTURA_TRACKING_URL': process.env.KALTURA_TRACKING_URL
    },
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
