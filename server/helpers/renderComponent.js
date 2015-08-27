var React = require('react');
var _ = require('lodash');
var camelCase = require('camelcase');
var disabledIsosByVariation = require('./disabledIsosByVariation');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function renderComponent(options) {

  var componentElement = options.componentElement;
  var componentName = camelCase(options.componentName);
  var componentVariation = options.componentVariation;
  var state = options.state;
  var slot = options.slot;

  var componentData = (slot && typeof(slot.data) === 'function')
    ? slot.data(state)
    : state;

  var output;

  if (_.get(slot, 'iso') && !_.includes(disabledIsosByVariation[componentName], componentVariation)) {
    var iso = new Iso();

    output = iso.wrap({
      component: componentElement,
      state: componentData,
      meta: {
        id: componentName,
        variation: componentVariation
      }
    });

  } else {
    var el = React.createElement(componentElement, componentData);
    output = React.renderToString(el, componentData);
  }

  return output;
};
