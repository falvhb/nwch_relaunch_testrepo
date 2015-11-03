var gulp = require('gulp');
var gutil = require('gulp-util');
var sequence = require('gulp-sequence').use(gulp);

// -----------------------------------------------------------------------------
// Clean
// -----------------------------------------------------------------------------
gulp.task('clean', require('./tasks/clean.js'));

// -----------------------------------------------------------------------------
// Sass
// -----------------------------------------------------------------------------
gulp.task('sass', require('./tasks/sass.js'));
gulp.task('sass:env', require('./tasks/sass-env.js'));
gulp.task('sass:watch', require('./tasks/sass-watch.js'));
gulp.task('sass:dashboard', require('./tasks/sass-dashboard.js'));

// -----------------------------------------------------------------------------
// Webpack
// -----------------------------------------------------------------------------
gulp.task('webpack', require('./tasks/webpack.js'));

// -----------------------------------------------------------------------------
// Server / Watch
// -----------------------------------------------------------------------------
gulp.task('server', require('./tasks/server.js'));

gulp.task('watch', [
  'sass:watch'
]);

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------
gulp.task('static-scripts', require('./tasks/static-scripts.js'));
gulp.task('static-images', require('./tasks/static-images.js'));
gulp.task('static-includes', require('./tasks/static-includes.js'));
gulp.task('icons', require('./tasks/icons.js'));
gulp.task('fonts', require('./tasks/fonts.js'));

gulp.task('assets', sequence('clean', [
  'sass:env',
  'sass:dashboard',
  'sass',
  'static-scripts',
  'static-images',
  'static-includes',
  'icons',
  'fonts'
]));

// -----------------------------------------------------------------------------
// Linting
// -----------------------------------------------------------------------------
gulp.task('eslint', require('./tasks/eslint.js'));
gulp.task('scss-lint', require('./tasks/scss-lint.js'));

gulp.task('lint', [
  'eslint',
  'scss-lint'
]);

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
gulp.task('test:react', require('./tasks/tests.js').react);
gulp.task('test:watch', require('./tasks/tests.js').reactWatch);
gulp.task('test:api', require('./tasks/tests.js').api);

gulp.task('test', [
  'test:react',
  'test:api'
]);

// -----------------------------------------------------------------------------
// Styleguide
// -----------------------------------------------------------------------------
gulp.task('sync-styleguide:typography', require('./tasks/sync-styleguide-typography.js'));
gulp.task('sync-styleguide:colors', require('./tasks/sync-styleguide-colors.js'));

gulp.task('sync-styleguide', [
  'sync-styleguide:typography',
  'sync-styleguide:colors'
]);

// -----------------------------------------------------------------------------
// Documentation
// -----------------------------------------------------------------------------
gulp.task('sassdoc', require('./tasks/sass-doc.js'));
gulp.task('esdoc', require('./tasks/esdoc.js'));
// deprecated: use esdoc preferably
gulp.task('jsdoc', require('./tasks/jsdoc.js'));

gulp.task('docs', [
  'sassdoc',
  'esdoc',
  'jsdoc'
]);

// -----------------------------------------------------------------------------
// Meta tasks
// -----------------------------------------------------------------------------

// Prod environment toggle
gulp.task('buildtask', function() {
  gutil.env.build = true;
});

// Production build
gulp.task('build', sequence('buildtask', 'assets', 'webpack', 'test', 'sync-styleguide', 'docs'));

// build the static files for production use without running tests
gulp.task('build_client', sequence('buildtask', 'assets', 'webpack'));

// Development
gulp.task('dev', sequence('server', 'watch', 'webpack'));

// Default task
gulp.task('default', ['dev']);
