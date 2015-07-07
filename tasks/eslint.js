var gulp = require('gulp');
var eslint = require('gulp-eslint');
var helpers = require('./lib/helpers.js');

var jsInput = [
  helpers.assetDir('scripts/**/*.js'),
  helpers.sourceDir('node_modules/**/*.js'),
  helpers.sourceDir('node_modules/**/*.jsx'),
  './server/**/*.js',
  './*.js'
];

module.exports = function() {
  return gulp
    .src(jsInput)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};
