/* eslint-disable no-console */
'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var pkg = require('./package.json');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sassdoc = require('sassdoc');
var webpack = require('gulp-webpack');

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isProd() {
  return !!plugins.util.env.prod;
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
  './views/components/**/*.js',
  './views/components/**/*.jsx',
  './server/**/*.js',
  './*.js'
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


// -----------------------------------------------------------------------------
// Linting
// -----------------------------------------------------------------------------

gulp.task('scss-lint', function() {
  return gulp
    .src(sassInput)
    .pipe(plugins.scssLint({ config: './.scss-lint.yml' }));
});

gulp.task('eslint', function() {
  return gulp
    .src(jsInput)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.failOnError());
});

gulp.task('lint', ['scss-lint', 'eslint']);


// -----------------------------------------------------------------------------
// Sass
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp
    .src(sassInput)
    .pipe(isDev() ? plugins.sourcemaps.init() : plugins.util.noop())
    .pipe(plugins.concat('styles.scss'))
    .pipe(plugins.sass(sassOptions))
    .pipe(isDev() ? plugins.sourcemaps.write() : plugins.util.noop())
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./client/stylesheets'))
    .pipe(plugins.util.env.livereload ? plugins.livereload() : plugins.util.noop());
});

gulp.task('sassdoc', function() {
  return gulp
    .src(sassInput)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// -----------------------------------------------------------------------------
// Watching
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
  if (plugins.util.env.livereload) {
    plugins.livereload.listen();
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

gulp.task('server', function() {
  plugins.nodemon({
    script: pkg.main,
    env: { 'NODE_ENV': (isProd() ? 'production' : 'development') }
  })
  .on('start', plugins.livereload.reload)
  .on('change', plugins.livereload.reload);
});


// -----------------------------------------------------------------------------
// Webpack compilation
// -----------------------------------------------------------------------------
var webpackConfig = require('./webpack.config.js');

if (isDev()) {
  webpackConfig.watch = true;
}

if (isProd()) {
  webpackConfig.plugins = webpackConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());
}

gulp.task('webpack', function() {
  return gulp
    .src('views/browser.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./client'));
});

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------

gulp.task('build', ['lint', 'sass', 'webpack', 'sassdoc']);


// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', ['lint', 'sass', 'server', 'webpack', 'watch']);
