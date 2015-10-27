/* eslint-disable no-unused-vars */
var gulp = require('gulp');
var exec = require('gulp-exec');

var options = {
  source: './app/node_modules',
  destination: './docs/jsdoc/doc',
};

var configFile = 'tasks/config/jsdoc.json';

module.exports = function() {
  var command = './node_modules/.bin/jsdoc ' + options.source + ' -d ' + options.destination + ' -c ' + configFile;

  return gulp
      // Just specify one file as source
      // The file itself is not used for the task.
      // We just have to provide one existing source file to run gulp.
      .src('./gulpfile.js')
      .pipe(
        exec([command])
      );
};
