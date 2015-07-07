var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');
var sassInput = require('./lib/sass-input.js');

var scssLintOptions = {
  config: './.scss-lint.yml'
};

module.exports = function() {
  return gulp
    .src(sassInput)
    .pipe(scssLint(scssLintOptions))
    .pipe(scssLint.failReporter());
};
