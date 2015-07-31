var helpers = require('./helpers.js');

var sassInput = (function() {
  var input = [
    helpers.assetDir('styles/globals.scss'),
    helpers.assetDir('styles/wufoo.scss'),
    helpers.assetDir('styles/base/*.scss'),
    helpers.assetDir('styles/utilities/*.scss'),
    helpers.sourceDir('node_modules/base/**/*.scss'),
    helpers.sourceDir('node_modules/components/**/*.scss'),
    helpers.sourceDir('node_modules/pages/**/*.scss')
  ];

  if (!helpers.isProduction()) {
    input.push(helpers.assetDir('styles/vendor/prism.scss'));
    input.push(helpers.sourceDir('node_modules/styleguide/**/styles/main.scss'));
  }

  return input;
}());

module.exports = sassInput;
