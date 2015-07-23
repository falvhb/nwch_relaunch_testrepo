var helpers = require('./lib/helpers.js');
var promisify = require('promisify-node');
var fs = promisify('fs');

module.exports = function () {
  var env = helpers.isProduction() ? 'prod' : 'dev';
  // var content = '$environment: ' + env + ';';
  return fs.writeFile(helpers.assetDir('styles/utilities/environment.scss'), env);
};
