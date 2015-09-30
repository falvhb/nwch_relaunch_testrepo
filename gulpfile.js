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
gulp.task('sass:env', require('./tasks/sass-env.js'));
gulp.task('sass:docs', require('./tasks/sass-doc.js'));
gulp.task('sass:wufoo', require('./tasks/wufoo.js'));

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
gulp.task('static-includes', require('./tasks/static-includes.js'));

// Tests
gulp.task('test:react', require('./tasks/tests.js').react);
gulp.task('test:react-local-watch', require('./tasks/tests.js').reactLocalWatch);
gulp.task('test:api', require('./tasks/tests.js').api);
gulp.task('test', ['test:react', 'test:api']);

// Living Styleguide
gulp.task('sync-styleguide:typography', require('./tasks/sync-styleguide-typography.js'));
gulp.task('sync-styleguide:colors', require('./tasks/sync-styleguide-colors.js'));
gulp.task('sync-styleguide', ['sync-styleguide:typography', 'sync-styleguide:colors']);

// -----------------------------------------------------------------------------
// Meta tasks
// -----------------------------------------------------------------------------

// Assets compilation
gulp.task('assets', sequence('clean', [
  'sass:env',
  'sass',
  'sass:wufoo',
  'static-scripts',
  'static-images',
  'static-includes',
  'icons',
  'fonts'
]));

// Prod environment toggle
gulp.task('buildtask', function() {
  gutil.env.build = true;
});

// Production build
gulp.task('build', sequence('buildtask', 'assets', 'webpack', 'test', 'sync-styleguide', 'sass:docs'));

// build the static files for production use without running tests
gulp.task('build_client', sequence('buildtask', 'assets', 'webpack'));

// Development
gulp.task('dev', sequence('server', 'watch', 'webpack'));

// Default task
gulp.task('default', ['dev']);
