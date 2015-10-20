/* eslint-disable no-unused-vars */
var gulp = require('gulp');
var exec = require('gulp-exec');

const pathToConfig = './tasks/config/esdoc.json';

module.exports = function() {
  var command = './node_modules/.bin/esdoc -c ' + pathToConfig;

  return gulp
      // Just specify one file as source
      // The file itself is not used for the task.
      // We just have to provide one existing source file to run gulp.
      .src('./gulpfile.js')
      .pipe(
        exec([command])
      );
};
