var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');
var helpers = require('./lib/helpers.js');
var sassInput = require('./lib/sass-input.js');

module.exports = function() {
  return gulp
    .src(sassInput)
    .pipe(scssLint({ config: './.scss-lint.yml' }))
    .pipe(scssLint.failReporter());
};
