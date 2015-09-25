var _ = require('lodash');
var karmaConfigDefault = require('./karma.conf.default');

var karmaConfig = _.assign({}, karmaConfigDefault, {
  autoWatch: true,
  browsers: [ 'Chrome' ],
  singleRun: false,
});

module.exports = function(config) {
  config.set(karmaConfig);
};
