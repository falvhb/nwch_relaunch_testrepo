var renderComponent = require('../helpers/renderComponent');

module.exports = function(req, res) {

  var params = req.params || {};

  var componentName = params.component;
  var componentVariation = params.variation;

  if (!componentName) {
    res.send('<!-- No component name provided! -->');
    return;
  }

  if (!componentVariation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }

  // resolve the component
  var component;
  try {
    component = require('../../app/node_modules/components/' + componentName);
  } catch (e) {
    res.send('<!-- Component "' + componentName + '" not found! -->');
    return;
  }

  // see if there is a slot function
  // this maps data from the full API response -> only the data a component needs
  var slot;
  try {
    slot = require('../../app/node_modules/components/' + componentName + '/slot');
  } catch (e) {
    // not found (is okay, continue)
  }

  function render() {
    req.article = req.api.get('article');

    if (req.article && !req.article.data) {
      // no article found
      res.write('<!-- Article "' + params.articleId + '" not found! -->\n');
      var errors = req.article.errors;
      if (errors && errors.length > 0) {
        res.write('<!-- Error detail: ' + errors[0].detail + ' -->\n');
      }
      res.end();
      return;
    }

    var state = {
      'article': req.article ? req.article.data : null,
      'variation': componentVariation,
      'skin': req.headers['x-skin'] || 'aaz',
      'path': req._parsedUrl.path
    };

    var output = renderComponent({
      component: component,
      componentName: componentName,
      componentVariation: componentVariation,
      state: state,
      slot: slot
    });

    res.send(output);
  }

  render();
};
