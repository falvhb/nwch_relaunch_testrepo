/* eslint-disable no-console */
'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var pkg = require('./package.json');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sassdoc = require('sassdoc');
var gulpSequence = require('gulp-sequence').use(gulp);


// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
var BUILD_DIR  = './client/';
var SOURCE_DIR = './assets/';

function assetDir(path) {
  return SOURCE_DIR + path;
}


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
// Clear build folder
// -----------------------------------------------------------------------------

gulp.task('clean', function() {
  return gulp.src(BUILD_DIR, {
    read: false
  }).pipe(plugins.clean());
});


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
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('lint', ['eslint', 'scss-lint']);


// -----------------------------------------------------------------------------
// Sass bundle
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp
    .src(sassInput)
    .pipe(isDev() ? plugins.sourcemaps.init() : plugins.util.noop())
    .pipe(plugins.concat('styles.scss'))
    .pipe(plugins.sass(sassOptions))
    .pipe(isDev() ? plugins.sourcemaps.write() : plugins.util.noop())
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(plugins.util.env.livereload ? plugins.livereload() : plugins.util.noop());
});

gulp.task('sassdoc', function() {
  return gulp
    .src(sassInput)
    .pipe(sassdoc(sassdocOptions))
    .pipe(plugins.exit())
    .resume();
});


// -----------------------------------------------------------------------------
// Webpack bundle
// -----------------------------------------------------------------------------
var webpackConfig = require('./webpack.config.js');

if (isDev()) {
  webpackConfig.watch = true;
}

if (isProd()) {
  webpackConfig.plugins = webpackConfig.plugins.concat(new plugins.webpack.optimize.UglifyJsPlugin());
}

gulp.task('webpack', function() {
  return gulp
    .src('views/browser.js')
    .pipe(plugins.webpack(webpackConfig))
    .pipe(gulp.dest(BUILD_DIR));
});


// -----------------------------------------------------------------------------
// Compress font files
// -----------------------------------------------------------------------------

gulp.task('fonts', function() {
  return gulp.src(assetDir('fonts/**/*.css'))
    .pipe(plugins.base64({
      baseDir: './assets/fonts/',
      maxImageSize: 100*1024,
      extensionsAllowed: ['woff', 'woff2'],
      debug: true
    }))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('fontloader', function() {
  return gulp.src(assetDir('javascripts/*.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(BUILD_DIR));
});


// -----------------------------------------------------------------------------
// Watch task
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
// <head> task
// -----------------------------------------------------------------------------

gulp.task('head', ['fonts', 'fontloader']);

// -----------------------------------------------------------------------------
// Bundle task
// -----------------------------------------------------------------------------

gulp.task('bundle', ['sass', 'webpack']);

// -----------------------------------------------------------------------------
// Build task
// -----------------------------------------------------------------------------

gulp.task('build', gulpSequence('lint', 'clean', ['head', 'bundle'], 'sassdoc'));

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', gulpSequence(['clean', 'server'], ['head', 'bundle'], 'watch'));
