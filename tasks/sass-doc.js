var gulp = require('gulp');
var sassdoc = require('sassdoc');
var helpers = require('./lib/helpers.js');

var sassdocOptions = {
  dest: helpers.sourceDir('docs/sass'),
  config: './.sassdocrc',
  verbose: true
};

module.exports = function() {
  return gulp
    .src([
      helpers.assetDir('styles/utilities/*.scss'),
      helpers.sourceDir('components/**/styles/utilities/*.scss')
    ])
    .pipe(sassdoc(sassdocOptions))
    .resume();
};
