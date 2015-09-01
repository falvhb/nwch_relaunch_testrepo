var Iso = require('../../app/node_modules/iso-react');
var Components = require('../modules/components');

module.exports = function(req, res) {

  var c = new Components(req, 'ressort-header');
  if (!c.getVariationName(res)) {
    return;
  }
  var component = c.getComponent(res);
  if (!component) {
    return;
  }
  var slot = c.slot();

  var result = req.api.get('ressortnav');
  var data = result || {
    ressort: {
      title: req.params.ressort
    }
  };
  var ressort = data.ressort;
  var subressorts = data.subressorts;

  var state = {
    'ressort': ressort,
    'subressorts': subressorts,
    'variation': c.variationName
  };

  // wrap component in isomorphic layer
  // injects data to DOM and attaches component id
  // component re-rendered client-side via app/client.js
  var iso = new Iso();
  var isoWrapped = iso.wrap({
    component: component,
    state: slot ? slot(state) : state,
    meta: {id: 'ressortHeader', variation: c.variationName}
  });

  res.send(isoWrapped);
};
