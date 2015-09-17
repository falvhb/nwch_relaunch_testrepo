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
  req.article = req.api.get('article');

  if (req.article && !req.article.data) {
    // if there is an article property but it contains no data then the
    // article could not be requested from the API.
    res.write('<!-- Article "' + req.params.articleId + '" not found! -->\n');
    var errors = req.article.errors;
    if (errors && errors.length > 0) {
      // the API reported an error
      res.write('<!-- Error detail: ' + errors[0].detail + ' -->\n');
    }
    res.end();
    return;
  }

  // map our data
  c.state = {
    'article': req.article ? req.article.data : null,
    'variation': c.variationName,
    'skin': getSkinName(req),
    'path': req._parsedUrl.path
  };

  // send component render
  res.send(renderComponent(c));
};
