var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  nodemon({
    script: pkg.main,
    env: {
      'NODE_ENV': (helpers.isProd ? 'production' : 'development'),
      'DISQUS_API_KEY': '???'
    }
  });
};
