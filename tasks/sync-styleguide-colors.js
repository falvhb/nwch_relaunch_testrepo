var _ = require('lodash');
var helpers = require('./lib/helpers.js');
var sync = require('./lib/sync-styleguide.js');

module.exports = function() {
  if (!helpers.isProduction()) {
    return sync(
      helpers.assetDir('styles/utilities/variables.scss'),
      helpers.sourceDir('node_modules/base/colors/.data.json'),
      postDataColors
    );
  }
};

function postDataColors(data) {
  return _
    .chain(data)
    .filter(function(item) {
      return item.group[0] === 'colors';
    })
    .map(function(item) {
      var chunks = item.description.split('\n');
      var first = chunks[0].split(' from ');

      return {
        name: first[0],
        value: item.context.value,
        description: chunks.slice(1).join(''),
        palette: first[1]
      };
    })
    .groupBy('palette')
    .map(function(item, value) {
      return {
        title: value,
        colors: item
      };
    })
    .value();
}
