var _ = require('lodash');
var Components = require('../modules/components');
var renderComponent = require('../modules/renderComponent');

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

  var subressortData = _.find(data.subressorts, function(chr) {
    return chr.urlpart === req.params.subressort;
  });

  // map our data
  c.state = {
    'ressort': data.ressort,
    'subressort': subressortData,
    'navigation': data.subressorts,
    'variation': c.variationName
  };

  // send component render
  res.send(renderComponent(c));
};
