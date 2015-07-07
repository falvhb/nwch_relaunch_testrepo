var karma = require('karma').server;
var path = require('path');

// API tests

function apiTests(done) {
  var mockaRunner = require('child_process').spawn('npm', ['run', 'mocha']);
  mockaRunner.stdout.pipe(process.stdout);
  mockaRunner.stderr.pipe(process.stderr);
  mockaRunner.on('exit', function(code) {
    var result = code > 0 ? code : null;
    done(result);
  });
}

// React tests

var karmaOptions = {
  configFile: path.join(__dirname, '../karma.conf.js'),
  singleRun: true
};

function reactTests(done) {
  return karma.start(karmaOptions, done);
}

module.exports = {
  api: apiTests,
  react: reactTests
};
