var React = require('react');
var _ = require('lodash');
var camelCase = require('camelcase');
var disabledIsosByVariation = require('./disabledIsosByVariation');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function renderComponent(params) {

  var output, component = params || {};

  component.componentName = camelCase(params.componentName);

  if (component.slot && typeof(component.slot.data) === 'function') {
    component.data = component.slot.data(component.state);
  } else if (component.slot.data == null) {
    component.data = component.state;
  }

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
};
