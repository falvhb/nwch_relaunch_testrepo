var gulp = require('gulp');
var sequence = require('gulp-sequence');

gulp.task('clean', require('./tasks/clean.js'));

gulp.task('eslint', require('./tasks/eslint.js'));
gulp.task('scss-lint', require('./tasks/scss-lint.js'));
gulp.task('lint', ['eslint', 'scss-lint']);

gulp.task('sass', require('./tasks/sass.js'));
gulp.task('sassdoc', require('./tasks/sassdoc.js'));

gulp.task('webpack', require('./tasks/webpack.js'));

gulp.task('fonts', require('./tasks/fonts.js'));
gulp.task('fontloader', require('./tasks/font-loader.js'));

gulp.task('watch', require('./tasks/watch.js'));
gulp.task('server', require('./tasks/server.js'));

gulp.task('icons', require('./tasks/icons.js'));
gulp.task('logo', require('./tasks/logo.js'));

gulp.task('test', require('./tasks/tests.js'));

gulp.task('sync-styleguide:typography', require('./tasks/sync-styleguide-typography.js'));
gulp.task('sync-styleguide:colors', require('./tasks/sync-styleguide-colors.js'));
gulp.task('styleguide', ['sync-styleguide:typography', 'sync-styleguide:colors']);

gulp.task('assets', sequence('clean', ['fonts', 'fontloader', 'icons', 'styleguide', 'logo']));
gulp.task('bundle', ['sass', 'webpack']);
gulp.task('build', sequence('assets', 'bundle'));
gulp.task('default', sequence('server', 'watch', 'bundle'));
