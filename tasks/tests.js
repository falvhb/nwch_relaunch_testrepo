var karma = require('karma').server;
var path = require('path');
var _ = require('lodash');

// Be sure to handle the exit code for each 'test runner' properly!
// `exitCodes` are summed and returned 'on process exit', see below.
var exitCodes = {
  api: 0,
  react: 0
};

// ensure proper exit codes;
process.on('exit', function() {
  var total = _.reduce(exitCodes, function(subTotal, n) {
    return subTotal + n;
  }, 0);
  process.exit(total);
});


// API tests
function apiTests(done) {
  var mockaRunner = require('child_process').spawn('npm', ['run', 'mocha']);
  mockaRunner.stdout.pipe(process.stdout);
  mockaRunner.stderr.pipe(process.stderr);
  mockaRunner.on('exit', function ensureExitCode(code) {
    exitCodes.api = code;
    done();
  });
}


// React tests
var karmaOptions = {
  configFile: path.join(__dirname, '../karma.conf.js'),
  singleRun: true
};

var karmaOptionsLocalWatch = _.assign({}, karmaOptions, {
  configFile: path.join(__dirname, '../karma.conf.local.js'),
  singleRun: false
});

function reactTests(done) {
  karma.start(karmaOptions, function ensureExitCode(exitCode) {
    exitCodes.react = exitCode;
    done();
  });
}

function reactTestsLocalWatch(done) {
  karma.start(karmaOptionsLocalWatch, function ensureExitCode(exitCode) {
    exitCodes.react = exitCode;
    done();
  });
}


module.exports = {
  api: apiTests,
  react: reactTests,
  reactLocalWatch: reactTestsLocalWatch
};
