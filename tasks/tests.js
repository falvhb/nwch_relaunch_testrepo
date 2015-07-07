var gulp = require('gulp');
var karma = require('karma');
var path = require('path');

module.exports = function(done) {
  karma.start({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done);
};
