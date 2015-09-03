var Components = require('../modules/components');
var renderComponent = require('../helpers/renderComponent');

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
    'skin': req.headers['x-skin'] || 'aaz',
    'path': req._parsedUrl.path
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
