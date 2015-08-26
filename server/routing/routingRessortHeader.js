var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {

  var params = req.params || {};

  var componentName = 'ressort-header';
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
    var result = req.api.get('ressortnav') || {};

    var data = result || {
      ressort: {
        title: req.params.ressort
      }
    };

    var ressort = data.ressort;
    var subressorts = data.subressorts;

    var state = {
      'ressort': ressort,
      'subressorts': subressorts,
      'variation': componentVariation
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
