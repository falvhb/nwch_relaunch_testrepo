/* eslint-disable no-unused-vars */
var gulp = require('gulp');
var shell = require('gulp-shell');

var options = {
  source: './app/node_modules/tracking',
  destination: './docs/jsdoc/app/tracking',
};

module.exports = function() {
  var command = './node_modules/.bin/jsdoc ' + options.source + ' -d ' + options.destination;

  return gulp
      // Just specify one file as source
      // The file itself is not used for the task.
      // We just have to provide one existing source file to run gulp.
      .src('./gulpfile.js')
      .pipe(
        shell([command])
      );
};
