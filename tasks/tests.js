var karma = require('karma');
var path = require('path');

var karmaOptions = {
  configFile: path.join(__dirname, 'karma.conf.js'),
  singleRun: true
};

module.exports = function(done) {
  karma.start(karmaOptions, done);
};
