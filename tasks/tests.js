var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');

module.exports = {
  api: function(done) {
    var mockaRunner = require('child_process').spawn('npm', ['run', 'mocha']);
    mockaRunner.stdout.pipe(process.stdout);
    mockaRunner.stderr.pipe(process.stderr);
    mockaRunner.on('exit', function(code) {
      done();
    });
  },
  react: function(done) {
    karma.start({
      configFile: path.join(__dirname, '../karma.conf.js'),
      singleRun: true
    }, done);
  }
};
