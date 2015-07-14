var helpers = require('./lib/helpers.js');
var sync = require('./lib/sync-styleguide.js');

module.exports = function() {
  if (!helpers.isProduction()) {
    return sync(
      helpers.assetDir('styles/utilities/mixins.scss'),
      helpers.sourceDir('node_modules/base/typography/.data.json'),
      postDataTypography
    );
  }
};

function postDataTypography(data) {
  return data
    .filter(function(item) {
      return item.context.name.match(/^type-/);
    })
    .map(function(item) {
      return {
        props: {
          title: item.example[0].description,
          description: item.description.replace('\n', ''),
          code: '.' + item.context.name + ' {' + item.context.code + '}'
        },
        content: item.example[0].code
      };
    });
}
