/* eslint-disable no-console */
'use strict';

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var pkg = require('./package.json');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sassdoc = require('sassdoc');


// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

var SOURCE_DIR = './app/';
var BUILD_DIR  = './client/';

var sourceDir = function(path) {
  return SOURCE_DIR + path;
};

var assetDir = function(path) {
  return sourceDir('assets/' + path);
};

var buildDir = function(path) {
  return BUILD_DIR + path;
};


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

var isProd = function() {
  return !!plugins.util.env.prod;
};

var isBuild = function() {
  return plugins.util.env._[0] === 'build';
};

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var sassInput = [
  assetDir('styles/globals.scss'),
  assetDir('styles/base/*.scss'),
  sourceDir('components/**/styles/main.scss')
];

var jsInput = [
  assetDir('scripts/**/*.js'),
  sourceDir('components/**/*.js'),
  sourceDir('components/**/*.jsx'),
  './server/**/*.js',
  './*.js'
];

var fontsInput = assetDir('fonts/**/*.css');

var sassOptions = {
  outputStyle: (isProd() ? 'compressed' : 'expanded'),
  errLogToConsole: isProd() === true,
  includePaths: [
    sourceDir('components'),
    assetDir('styles')
  ]
};

var sassdocOptions = {
  dest: sourceDir('sassdoc'),
  config: './.sassdocrc',
  verbose: true
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'IE 9', '> 5%', 'Firefox ESR']
};

var webpackConfig = require('./webpack.config.js');

if (isBuild() || isProd()) {
  webpackConfig.watch = false;
}

if (isProd()) {
  webpackConfig.plugins = webpackConfig.plugins.concat(new plugins.webpack.optimize.UglifyJsPlugin());
}


// -----------------------------------------------------------------------------
// Clear build folder
// -----------------------------------------------------------------------------

gulp.task('clean', function() {
  return gulp
    .src(BUILD_DIR, {
      read: false
    })
    .pipe(plugins.clean());
});


// -----------------------------------------------------------------------------
// Linting
// -----------------------------------------------------------------------------

gulp.task('eslint', function() {
  return gulp
    .src(jsInput)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('scss-lint', function() {
  return gulp
    .src(sassInput)
    .pipe(plugins.scssLint({ config: './.scss-lint.yml' }))
    .pipe(plugins.scssLint.failReporter());
});

gulp.task('lint', ['eslint', 'scss-lint']);


// -----------------------------------------------------------------------------
// Sass bundle
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp
    .src(sassInput)
    .pipe(plugins.sass(sassOptions))
    .pipe(plugins.concat('styles.css'))
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(plugins.util.env.livereload ? plugins.livereload() : plugins.util.noop());
});

gulp.task('sassdoc', function() {
  return gulp
    .src([
      assetDir('styles/utilities/*.scss'),
      sourceDir('components/**/styles/utilities/*.scss')
    ])
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// -----------------------------------------------------------------------------
// Webpack bundle
// -----------------------------------------------------------------------------

gulp.task('webpack', function() {
  return gulp
    .src(sourceDir('browser.js'))
    .pipe(plugins.webpack(webpackConfig))
    .pipe(gulp.dest(BUILD_DIR));
});


// -----------------------------------------------------------------------------
// Compress font files
// -----------------------------------------------------------------------------

gulp.task('fonts', function() {
  return gulp
    .src(fontsInput)
    .pipe(plugins.base64({
      baseDir: assetDir('fonts'),
      maxImageSize: 100 * 1024,
      extensionsAllowed: ['woff', 'woff2'],
      debug: true
    }))
    .pipe(gulp.dest(buildDir('fonts')));
});

gulp.task('fontloader', function() {
  return gulp
    .src(assetDir('scripts/*.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(buildDir('scripts')));
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

gulp.task('build', plugins.sequence('lint', 'clean', ['head', 'bundle'], 'sassdoc'));


// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

gulp.task('default', plugins.sequence('clean', ['server', 'head', 'bundle', 'watch']));
