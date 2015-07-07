var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  return gulp
    .src(helpers.sassInput())
    .pipe(scssLint({ config: './.scss-lint.yml' }))
    .pipe(scssLint.failReporter());
};
