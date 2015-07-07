var gulp = require('gulp');
var webpack = require('gulp-webpack');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  var webpackConfig = helpers.isProd()
    ? require('../webpack.prod.config.js')
    : require('../webpack.config.js');

  if (helpers.isProd()) {
    webpackConfig.watch = false;
  } else {
    webpackConfig.plugins = false;
  }

  return gulp
    .src(helpers.SOURCE_DIR)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(helpers.BUILD_DIR));
};
