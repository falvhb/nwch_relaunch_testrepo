var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {

  var params = req.params || {};

  var componentName = params.component;
  var componentVariation = params.variation || 'default';

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
    var result = req.api.get('dossier') || {};

    var dossier = result && result.data ? result.data[0] : null;
    var kwresult = req.api.get('related_keywords') || {};

    var keywords = kwresult && kwresult.data ? kwresult.data : null;
    var kws = [];
    keywords.forEach(function(v) {
      kws.push(v[0]);
    });

    var state = {
      'dossier': dossier,
      'keywords': kws,
      'variation': componentVariation,
      'skin': req.headers['x-skin'] || 'aaz',
      'path': req._parsedUrl.path
    };

    // wrap component in isomorphic layer
    // injects data to DOM and attaches component id
    // component re-rendered client-side via app/client.js
    var iso = new Iso();
    var isoWrapped = iso.wrap({
      component: component,
      state: (slot && typeof(slot.data) === 'function') ? slot.data(state) : state,
      meta: {
        id: camelCase(componentName),
        variation: componentVariation
      }
    });

    res.send(isoWrapped);
  }

  render();
};
