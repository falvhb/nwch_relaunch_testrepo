var helpers = require('./helpers.js');

var client = [
  helpers.assetDir('styles/globals.scss'),
  helpers.assetDir('styles/base/*.scss'),
  helpers.assetDir('styles/utilities/*.scss'),
  helpers.sourceDir('node_modules/base/**/*.scss'),
  helpers.sourceDir('node_modules/components/**/*.scss'),
  helpers.sourceDir('node_modules/pages/**/*.scss')
];

var styleguide = [
  helpers.assetDir('styles/vendor/prism.scss'),
  helpers.sourceDir('node_modules/styleguide/**/styles/main.scss')
];

var dashboard = [
  helpers.sourceDir('node_modules/dashboard/**/*.scss')
];

var allInputs = client.concat(dashboard).concat(styleguide);

var input = function(type) {
  return type;
};

module.exports = {
  client: input(client),
  styleguide: input(styleguide),
  dashboard: input(dashboard),
  all: allInputs
};

