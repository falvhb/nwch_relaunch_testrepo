var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
var helpers = require('./lib/helpers');

// load all env variables
var envPath = helpers.isProduction() ? '.env' : '.env.dev';
require('dotenv').load({
  path: envPath
});

module.exports = function() {
  nodemon({
    script: pkg.main,
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
