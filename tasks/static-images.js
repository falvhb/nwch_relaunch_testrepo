var gulp = require('gulp');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  return gulp
    .src(helpers.assetDir('images/**/*'))
    .pipe(gulp.dest(helpers.buildDir('images')));
};
