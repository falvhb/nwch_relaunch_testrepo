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
gulp.task('sass:client', require('./tasks/sass-client.js'));
gulp.task('sass:dashboard', require('./tasks/sass-dashboard.js'));
gulp.task('sass:styleguide', require('./tasks/sass-styleguide.js'));
gulp.task('sass:watch', require('./tasks/sass-watch.js'));

gulp.task('sass', [
  'sass:client',
  'sass:dashboard',
  'sass:styleguide'
]);

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
gulp.task('static:scripts', require('./tasks/static-scripts.js'));
gulp.task('static:images', require('./tasks/static-images.js'));
gulp.task('static:includes', require('./tasks/static-includes.js'));
gulp.task('static:icons', require('./tasks/icons.js'));
gulp.task('static:fonts', require('./tasks/fonts.js'));

gulp.task('assets', sequence('clean', [
  'sass:client',
  'sass:dashboard',
  'sass:styleguide',
  'static:scripts',
  'static:images',
  'static:includes',
  'static:icons',
  'static:fonts'
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

gulp.task('styleguide', [
  'sync-styleguide:typography',
  'sync-styleguide:colors'
]);

// -----------------------------------------------------------------------------
// Documentation
// -----------------------------------------------------------------------------
gulp.task('docs:sassdoc', require('./tasks/sass-doc.js'));
gulp.task('docs:esdoc', require('./tasks/esdoc.js'));
// deprecated: use esdoc preferably
gulp.task('docs:jsdoc', require('./tasks/jsdoc.js'));

gulp.task('docs', [
  'docs:sassdoc',
  'docs:esdoc',
  'docs:jsdoc'
]);

// -----------------------------------------------------------------------------
// Meta tasks
// -----------------------------------------------------------------------------

// Prod environment toggle
gulp.task('building', function() {
  gutil.env.build = true;
});

// Production build
gulp.task('build', sequence('building', 'assets', 'webpack', 'styleguide', 'docs'));

// Build with tests
gulp.task('build:test', sequence('test', 'build'));

// Development
gulp.task('dev', sequence('assets', 'server', 'watch', 'webpack'));

// Default task
gulp.task('default', ['dev']);
