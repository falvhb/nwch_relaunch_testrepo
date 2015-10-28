var Components = require('../modules/components');
var renderComponent = require('../modules/renderComponent');
var getSkinName = require('../modules/skin');

module.exports = function(req, res) {

  // require elements
  var c = new Components(req);
  c.element = c.getComponent(res);
  c.slot = c.getSlot();

  if (!c.element || !c.getVariationName(res)) {
    return;
  }

  // get data
  var result = req.api.get('city') || {};
  var city = result && result.data ? result.data[0] : null;

  // map our data
  c.state = {
    'city': city,
    'variation': c.variationName,
    'skin': getSkinName(req),
    'path': req._parsedUrl.path
  };

  // send component render
  res.send(renderComponent(c));
};
