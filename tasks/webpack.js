var gulp = require('gulp');
var webpack = require('gulp-webpack');
var helpers = require('./lib/helpers.js');

var webpackConfig = (function() {
  var config = require('../webpack.config.js');

  if (helpers.isBuild() || helpers.isProd()) {
    config.watch = false;
  } else {
    config.plugins = false;
  }

  return config;
}());

module.exports = function() {
  return gulp
    .src(helpers.SOURCE_DIR)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(helpers.BUILD_DIR));
};
