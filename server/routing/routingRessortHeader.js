var Components = require('../modules/components');
var renderComponent = require('../helpers/renderComponent');

module.exports = function(req, res) {

  // require elements
  var c = new Components(req, 'ressort-header');
  c.element = c.getComponent(res);
  c.slot = c.getSlot();

  if (!c.element || !c.getVariationName(res)) {
    return;
  }

  // get data
  var fallback = {
    ressort: {
      title: req.params.ressort
    },
    subressorts: {}
  };

  var data = req.api.get('ressortnav') || fallback;

  // map our data
  c.state = {
    'ressort': data.ressort,
    'subressorts': data.subressorts,
    'variation': c.variationName
  };

  // send component render
  var send = {
    element: c.element,
    name: c.componentName,
    variation: c.variationName,
    state: c.state,
    slot: c.slot
  };

  res.send(renderComponent(send));
};
