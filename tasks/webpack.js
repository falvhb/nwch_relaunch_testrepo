var gulp = require('gulp');
var webpack = require('gulp-webpack');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  var webpackConfig = helpers.isProd()
    ? require('../webpack.prod.config.js')
    : require('../webpack.config.js');

  if (helpers.isDev()) {
    webpackConfig.watch = true;
  }

  return gulp
    .src(helpers.SOURCE_DIR)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(helpers.BUILD_DIR));
};
