var gutil = require('gulp-util');

module.exports = {
  SOURCE_DIR: './app/',
  BUILD_DIR:  './client/',

  sourceDir: function(path) {
    return this.SOURCE_DIR + path;
  },

  assetDir: function(path) {
    return this.sourceDir('assets/' + path);
  },

  buildDir: function(path) {
    return this.BUILD_DIR + path;
  },

  isProd: function() {
    return !!gutil.env.production || !!gutil.env.prod;
  },

  isBuild: function() {
    return gutil.env._[0] === 'build';
  },

  // Don't break watch on error
  onError: function(err) {
    gutil.beep();
    console.log(err);
    this.emit('end');
  },

  sassInput: function() {
    var input = [
      this.assetDir('styles/globals.scss'),
      this.assetDir('styles/base/*.scss'),
      this.sourceDir('node_modules/base/**/*.scss'),
      this.sourceDir('node_modules/components/**/*.scss')
    ];

    if (!this.isProd()) {
      input.push(this.assetDir('styles/vendor/prism.scss'));
      input.push(this.sourceDir('node_modules/styleguide/**/styles/main.scss'));
    }

    return input;
  }
};
