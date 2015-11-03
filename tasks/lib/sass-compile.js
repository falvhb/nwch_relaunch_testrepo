var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var helpers = require('./helpers.js');

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'IE 9', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  outputStyle: (helpers.isBuild() ? 'compressed' : 'expanded'),
  errLogToConsole: helpers.isBuild() === true,
  includePaths: [
    helpers.sourceDir('components'),
    helpers.assetDir('styles')
  ]
};

module.exports = function(input, output) {
  return function() {
    return gulp
      .src(input)
      .pipe(plumber({ errorHandler: helpers.onError }))
      .pipe(sass(sassOptions))
      .pipe(concat(output))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(gulp.dest(helpers.BUILD_DIR));
  };
};
