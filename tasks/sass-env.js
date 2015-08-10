var helpers = require('./lib/helpers.js');
var fs = require('fs');

module.exports = function () {
  var env = helpers.isProduction() ? 'prod' : 'dev';
  var content = '$environment: \'' + env + '\';\n\n';
  return fs.writeFileSync(helpers.assetDir('styles/utilities/environment.scss'), content);
};
