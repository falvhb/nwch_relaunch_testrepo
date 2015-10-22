var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var helpers = require('./lib/helpers.js');

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'IE 9', '> 5%', 'Firefox ESR']
};

var sassOptions = {
  outputStyle: (helpers.isProduction() ? 'compressed' : 'expanded'),
  errLogToConsole: helpers.isProduction() === true,
  includePaths: [
    helpers.sourceDir('components'),
    helpers.assetDir('styles')
  ]
};

module.exports = function() {
  return gulp
    .src([helpers.sourceDir('node_modules/dashboard/**/*.scss')])
    .pipe(plumber({ errorHandler: helpers.onError }))
    .pipe(sass(sassOptions))
    .pipe(concat('dashboard.css'))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(helpers.BUILD_DIR));
};
