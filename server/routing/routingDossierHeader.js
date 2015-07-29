var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {

  var params = req.params;

  var componentName = 'dossier-header';

  var componentVariation = params.variation;
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
  // this typically maps data from the full API response -> only the data a component needs
  var slot;
  try {
    slot = require('../../app/node_modules/components/' + componentName + '/slot');
  } catch (e) {
    // not found (is okay, continue)
  }

  function render() {
    var result = req.item || {};
    var dossier = result && result.data ? result.data[0] : null;

    var state = {
      'dossier': dossier,
      'variation': componentVariation
    };

    // wrap component in isomorphic layer
    // injects data to DOM and attaches component id
    // component re-rendered client-side via app/client.js
    var iso = new Iso();
    var isoWrapped = iso.wrap({
      component: component,
      state: slot ? slot(state) : state,
      meta: {
        id: camelCase(componentName),
        variation: componentVariation
      }
    });

    res.send(isoWrapped);
  }

  // do the dossier query
  var queryParams = {
    'path': 'dossier/' + req.params.dossier
  };

  req.app.models.NewsRessort.query(
    queryParams,
    function(err, result) {
      if (err) {
        req.item = null;
      } else {
        // got a result to render
        req.item = result;
      }
      render();
    }
  );
};
