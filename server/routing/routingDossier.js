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
  var result = req.api.get('dossier') || {};
  var dossier = result && result.data ? result.data[0] : null;

  var keywordsResult = req.api.get('related_keywords') || {};
  var keywords = keywordsResult && keywordsResult.data ? keywordsResult.data : [];
  var keywordsArray = [];
  keywords.forEach(function(v) {
    keywordsArray.push(v[0]);
  });

  // map our data
  c.state = {
    'dossier': dossier,
    'keywords': keywordsArray,
    'variation': c.variationName,
    'skin': getSkinName(req),
    'path': req._parsedUrl.path
  };

  // send component render
  res.send(renderComponent(c));
};
