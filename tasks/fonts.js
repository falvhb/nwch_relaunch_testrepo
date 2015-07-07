var gulp = require('gulp');
var base64 = require('gulp-base64');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  return gulp
    .src(helpers.assetDir('fonts/**/*.css'))
    .pipe(base64({
      baseDir: helpers.assetDir('fonts'),
      maxImageSize: 200 * 1024,
      extensionsAllowed: ['woff', 'woff2'],
      debug: true
    }))
    .pipe(gulp.dest(helpers.buildDir('fonts')));
};
