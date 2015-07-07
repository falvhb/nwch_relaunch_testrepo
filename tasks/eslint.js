var gulp = require('gulp');
var eslint = require('gulp-eslint');
var helpers = require('./lib/helpers.js');

var jsInput = [
  // All static JS files form assets folder
  helpers.assetDir('scripts/**/*.js'),
  // All JS files from source folder
  helpers.sourceDir('node_modules/**/*.js'),
  // All JSX files from source folder
  helpers.sourceDir('node_modules/**/*.jsx'),
  // All files from server/
  './server/**/*.js',
  // Any script / Gulpfile at root
  './*.js',
  // Gulp tasks
  './tasks/*.js'
];

module.exports = function() {
  return gulp
    .src(jsInput)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};
