'use strict';


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var pkg = require('./package.json');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var sassdoc = require('sassdoc');
var nodemon = require('gulp-nodemon');
var scsslint = require('gulp-scss-lint');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isProd() {
  return !!gutil.env.prod;
}

function isDev() {
  return !isProd();
}


// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var sassInput = [
  './assets/stylesheets/**/*.scss',
  './views/components/**/main.scss'
];

var jsInput = [
  './assets/javascripts/**/*.js',
  './views/components/**/index.jsx'
];

var sassOptions = {
  outputStyle: (isProd() ? 'compressed' : 'expanded')
};

var sassdocOptions = {
  dest: './views/sassdoc',
  config: './.sassdocrc',
  verbose: true
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'IE 9', '> 5%', 'Firefox ESR']
};

var node;


// -----------------------------------------------------------------------------
// Linting
// -----------------------------------------------------------------------------

gulp.task('scss-lint', function () {
  return gulp
    .src(sassInput)
    .pipe(scsslint({ config: './.scss-lint.yml' }));
});

gulp.task('eslint', function () {
  return gulp
    .src(jsInput)
    .pipe(eslint({ configFile: './.eslintrc' }));
});

gulp.task('lint', ['scss-lint', 'eslint'], function () {});


// -----------------------------------------------------------------------------
// Sass
// -----------------------------------------------------------------------------

gulp.task('sass', function () {
  return gulp
    .src(sassInput)
    .pipe(isDev() ? sourcemaps.init() : gutil.noop())
    .pipe(concat('app.scss'))
    .pipe(sass(sassOptions))
    .pipe(isDev() ? sourcemaps.write() : gutil.noop())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./client/stylesheets'))
    .pipe(!!gulp.env.livereload ? livereload() : gutil.noop());
});

gulp.task('sassdoc', function () {
  return gulp
    .src(sassInput)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// -----------------------------------------------------------------------------
// Watching
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
  if (!!gulp.env.livereload) {
    livereload.listen();
  }

  return gulp
    .watch(sassInput, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


// -----------------------------------------------------------------------------
// Node server
// -----------------------------------------------------------------------------

gulp.task('server', function () {
  nodemon({
    script: pkg.main,
    env: { 'NODE_ENV': (isProd() ? 'production' : 'development') }
  })
  .on('start', livereload.reload)
  .on('change', livereload.reload);
});


// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------

gulp.task('build', ['lint', 'sass', 'sassdoc']);


// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', ['lint', 'sass', 'server', 'watch']);
