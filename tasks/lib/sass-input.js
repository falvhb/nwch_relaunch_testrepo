var helpers = require('./helpers.js');

var sassInput = (function() {
  var input = [
    helpers.assetDir('styles/globals.scss'),
    helpers.assetDir('styles/base/*.scss'),
    helpers.sourceDir('node_modules/base/**/*.scss'),
    helpers.sourceDir('node_modules/components/**/*.scss')
  ];

  if (!helpers.isProd()) {
    input.push(helpers.assetDir('styles/vendor/prism.scss'));
    input.push(helpers.sourceDir('node_modules/styleguide/**/styles/main.scss'));
  }

  return input;
}());

module.exports = sassInput;
