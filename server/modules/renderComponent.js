var React = require('react');
var _ = require('lodash');
var camelCase = require('camelcase');
var disabledIsosByVariation = require('./disabledIsosByVariation');
var Iso = require('../../app/node_modules/iso-react');

function containsData(target) {
  for (var key in target) {
    if (target[key] && target[key] !== null) return true;
  }
  return false;
}

module.exports = function renderComponent(params) {

  var output, component = params || {};
  var slotData = _.get(component, 'slot.data');

  component.componentName = camelCase(params.componentName);

  if (component.slot && typeof(slotData) === 'function') {
    component.data = slotData(component.state);
  } else if (!slotData) {
    component.data = component.state;
  }

  if (containsData(component.data)) {
    if (_.get(component.slot, 'iso') && !_.includes(disabledIsosByVariation[component.componentName], component.componentVariation)) {

      var iso = new Iso();

      output = iso.wrap({
        component: component.element,
        state: component.data,
        meta: {
          id: component.componentName,
          variation: component.componentVariation
        }
      });

    } else {
      var el = React.createElement(component.element, component.data);
      output = React.renderToString(el, component.data);
    }

    return output;
  }

  return null;
};
