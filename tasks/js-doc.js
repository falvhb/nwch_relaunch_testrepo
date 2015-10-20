/* eslint-disable no-unused-vars */
var gulp = require('gulp');
var shell = require('gulp-shell');

module.exports = function() {
  return gulp.
      src('./app/node_modules/tracking/jsdoc-dummy.js')
      .pipe(
        shell([
          './node_modules/.bin/jsdoc ./app/node_modules/tracking/jsdoc-dummy.js -d ./docs/jsdoc/app/tracking'
        ])
      );
};
