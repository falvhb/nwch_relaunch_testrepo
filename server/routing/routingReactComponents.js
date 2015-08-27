var renderComponent = require('../helpers/renderComponent');

module.exports = function(req, res) {

  var params = req.params || {};

  var component = {};

  component.name = params.component;
  component.variation = params.variation;

  if (!component.name) {
    res.send('<!-- No component name provided! -->');
    return;
  }

  if (!component.variation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }

  // resolve the component
  try {
    component.element = require('../../app/node_modules/components/' + component.name);
  } catch (e) {
    res.send('<!-- Component "' + component.name + '" not found! -->');
    return;
  }

  // see if there is a slot function
  // this maps data from the full API response -> only the data a component needs
  try {
    component.slot = require('../../app/node_modules/components/' + component.name + '/slot');
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

    component.state = {
      'article': req.article ? req.article.data : null,
      'variation': component.variation,
      'skin': req.headers['x-skin'] || 'aaz',
      'path': req._parsedUrl.path
    };

    res.send(renderComponent(component));
  }

  render();
};
