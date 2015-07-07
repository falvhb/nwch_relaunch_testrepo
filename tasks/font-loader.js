var gulp = require('gulp');
var uglify = require('gulp-uglify');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  return gulp
    .src(helpers.assetDir('scripts/**/*.js'))
    .pipe(uglify())
    .pipe(gulp.dest(helpers.buildDir('scripts')));
};
