var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');
var Components = require('../modules/components');

module.exports = function(req, res) {

  // get params
  var params = req.params || {};

  // check if this is a request with an article involved
  req.article = req.api.get('article');
  if (req.article && !req.article.data) {
    // if there is an article property but it contains no data then the
    // article could not be requested from the API.
    res.write('<!-- Article "' + params.articleId + '" not found! -->\n');
    var errors = req.article.errors;
    if (errors && errors.length > 0) {
      // the API reported an error
      res.write('<!-- Error detail: ' + errors[0].detail + ' -->\n');
    }
    res.end();
    return;
  }
  var c = new Components(req);
  var component = c.getComponent(res);
  if (!component) {
    return;
  }
  if (!c.variationName) {
    return;
  }
  var slot = c.slot();

  var articleData = null;
  if (req.article) {
    articleData = req.article.data;
  }

  // map our data to pass it to the slot or the component
  var state = {
    'article': articleData,
    'variation': c.variationName,
    'skin': req.headers['x-skin'] || 'aaz',
    'path': req._parsedUrl.path
  };

  // wrap component in isomorphic layer
  // injects data to DOM and attaches component id
  // component re-rendered client-side via app/client.js
  var iso = new Iso();
  var isoWrapped = iso.wrap({
    component: component,
    state: slot ? slot(state) : state,
    meta: { id: camelCase(c.componentName), variation: c.variationName }
  });

  res.send(isoWrapped);
};
