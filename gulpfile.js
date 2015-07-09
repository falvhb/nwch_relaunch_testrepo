var gulp = require('gulp');
var gutil = require('gulp-util');
var sequence = require('gulp-sequence').use(gulp);

// -----------------------------------------------------------------------------
// Single tasks
// -----------------------------------------------------------------------------

// Wipe out the build folder
gulp.task('clean', require('./tasks/clean.js'));

// Lint the code
gulp.task('eslint', require('./tasks/eslint.js'));
gulp.task('scss-lint', require('./tasks/scss-lint.js'));
gulp.task('lint', ['eslint', 'scss-lint']);

// Compile Sass and its documentation
gulp.task('sass', require('./tasks/sass.js'));
gulp.task('sassdoc', require('./tasks/sassdoc.js'));

// Run WebPack
gulp.task('webpack', require('./tasks/webpack.js'));

// Deal with the custom fonts
gulp.task('fonts', require('./tasks/fonts.js'));

// Server and watchers
gulp.task('watch', require('./tasks/watch.js'));
gulp.task('server', require('./tasks/server.js'));

// Static assets
gulp.task('icons', require('./tasks/icons.js'));
gulp.task('static-scripts', require('./tasks/static-scripts.js'));
gulp.task('static-images', require('./tasks/static-images.js'));

// Tests
gulp.task('test', require('./tasks/tests.js'));

// Living Styleguide
gulp.task('sync-styleguide:typography', require('./tasks/sync-styleguide-typography.js'));
gulp.task('sync-styleguide:colors', require('./tasks/sync-styleguide-colors.js'));
gulp.task('sync-styleguide', ['sync-styleguide:typography', 'sync-styleguide:colors']);

// -----------------------------------------------------------------------------
// Meta tasks
// -----------------------------------------------------------------------------

// Assets compilation
gulp.task('assets', sequence('clean', [
  'sass',
  'static-scripts',
  'static-images',
  'icons',
  'fonts'
]));

// Prod environment toggle
gulp.task('env-prod', function() {
  gutil.env = 'production';
});

gulp.task('env-heroku', function() {
  gutil.env = 'heroku';
});

gulp.task('env-dev', function() {
  gutil.env = 'dev';
});

// Prod build
gulp.task('build', sequence('env-prod', 'test', 'assets', 'webpack'));

// Styleguide (Heroku build)
gulp.task('styleguide', sequence('env-heroku', 'test', 'assets', 'webpack', 'sassdoc', 'sync-styleguide'));

// Development environment
gulp.task('dev', sequence('env-dev', 'server', 'watch', 'webpack'));

// Default task
gulp.task('default', ['dev']);
