var del = require('del');
var helpers = require('./lib/helpers.js');

module.exports = function(cb) {
  del([helpers.BUILD_DIR], cb);
};
