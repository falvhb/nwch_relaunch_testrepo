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
  var result = req.api.get('latestarticles') || {};

  var articles = result && result.data ? result.data : null;

  // map our data
  c.state = {
    'articles': [articles],
    'variation': c.variationName,
    'skin': getSkinName(req),
    'path': req._parsedUrl.path
  };

  // send component render
  res.send(renderComponent(c));
};
