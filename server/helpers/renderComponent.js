var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function renderComponent(options) {
  var component = options.component;
  var componentName = options.componentName;
  var componentVariation = options.componentVariation;
  var state = options.state;
  var slot = options.slot;
  var iso = new Iso();
  var isoWrapped = iso.wrap({
    component: component,
    state: (slot && typeof(slot.data) === 'function') ? slot.data(state) : state,
    meta: {
      id: camelCase(componentName),
      variation: componentVariation
    }
  });
  return isoWrapped;
};
