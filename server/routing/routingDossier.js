var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');
var Components = require('../modules/components');

module.exports = function(req, res) {

  var c = new Components(req);
  if (!c.getVariationName(res)) {
    return;
  }
  var component = c.getComponent(res);
  if (!component) {
    return;
  }
  var slot = c.slot();
  var result = req.api.get('dossier') || {};
  var dossier = result && result.data ? result.data[0] : null;
  var kwresult = req.api.get('related_keywords') || {};
  var keywords = kwresult && kwresult.data ? kwresult.data : [];
  var kws = [];
  keywords.forEach(function(v) {
    kws.push(v[0]);
  });

  var state = {
    'dossier': dossier,
    'keywords': kws,
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
    meta: {id: camelCase(c.componentName), variation: c.variationName}
  });

  res.send(isoWrapped);
};
