var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {

  function render() {
    // get params
    var params = req.params || {};

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

    var componentName = params.component;
    if (!componentName) {
      res.send('<!-- No component name provided! -->');
      return;
    }
    var componentVariation = params.variation;
    if (!componentVariation) {
      res.send('<!-- No variation name provided! -->');
      return;
    }

    var articleData = null;
    if (req.article) {
      articleData = req.article.data;
    }

    // map our data
    var state = {
      'article': articleData,
      'variation': componentVariation,
      'skin': req.headers['x-skin'] || 'aaz',
      'path': req._parsedUrl.path
    };

    // resolve the component
    var component;
    try {
      component = require('../../app/node_modules/components/' + componentName);
    } catch (e) {
      res.send('<!-- Component "' + componentName + '" not found! -->');
      return;
    }

    // see if there is a slot function
    // this typically maps data from the full API response -> only the data a component needs
    var slot;

    try {
      slot = require('../../app/node_modules/components/' + componentName + '/slot');
    } catch (e) {
      // not found (is okay, continue)
    }

    // wrap component in isomorphic layer
    // injects data to DOM and attaches component id
    // component re-rendered client-side via app/client.js
    var iso = new Iso();
    var isoWrapped = iso.wrap({
      component: component,
      state: (slot && typeof(slot.data) === 'function') ? slot.data(state) : state,
      meta: { id: camelCase(componentName), variation: componentVariation }
    });

    res.send(isoWrapped);
  }

  render();
};
