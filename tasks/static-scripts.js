var gulp = require('gulp');
var helpers = require('./lib/helpers.js');
var uglify = require('gulp-uglify');

module.exports = function() {
  return gulp
    .src(helpers.assetDir('scripts/**/*.js'))
    .pipe(uglify())
    .pipe(gulp.dest(helpers.buildDir('scripts')));
};
