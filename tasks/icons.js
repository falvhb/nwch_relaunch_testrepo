var gulp = require('gulp');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var path = require('path');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  return gulp
    .src(helpers.assetDir('images/icons/sprite/*.svg'))
    .pipe(wrap(function(data) {
      var name = path.basename(data.file.path, '.svg');
      return '<symbol id="' + name + '" viewbox="0 0 20 20"><title>' + name + '</title><%= contents %></symbol>';
    }))
    .pipe(concat('icons.svg'))
    .pipe(wrap('<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><%= contents %></svg>'))
    .pipe(gulp.dest(helpers.buildDir('images')));
};
