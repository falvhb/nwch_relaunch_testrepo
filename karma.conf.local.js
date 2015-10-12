var _ = require('lodash');
var karmaConfigDefault = require('./karma.conf.default');

var karmaConfig = _.assign({}, karmaConfigDefault, {
  client: {
    captureConsole: true
  },
  autoWatch: true,
  browsers: [ 'PhantomJS'/*'Chrome'*/ ],
  singleRun: false,
});

module.exports = function(config) {
  config.set(karmaConfig);
};
