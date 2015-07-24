var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
var helpers = require('./lib/helpers');

// load all env variables
var envVars = helpers.ENV_VARS;
var envPath = helpers.isProduction() ? '.env' : '.env.dev';
require('dotenv').load({
  path: envPath
});

// put them into an object for nodemon
var envObj = {};
for (var i = 0; i < envVars.length; ++i) {
  var key = envVars[i];
  envObj[key] = process.env[key];
}

module.exports = function() {
  nodemon({
    script: pkg.main,
    env: envObj,
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
