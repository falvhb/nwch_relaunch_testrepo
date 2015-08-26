var renderComponent = require('../helpers/renderComponent');

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
