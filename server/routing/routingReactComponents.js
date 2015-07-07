var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {

  // get params
  var articleData = req.item.data;

  if (!articleData) {
    // no article found
    res.write('<!-- Article "' + req.params.articleId + '" not found! -->\n');
    var errors = req.item.errors;
    if (errors && errors.length > 0) {
      res.write('<!-- Error detail: ' + errors[0].detail + ' -->\n');
    }
    res.end();
    return;
  }

  var componentName = req.params.component;
  var componentVariation = req.params.variation;

  // map our data
  var state = {
    "article": articleData,
    "variation": componentVariation
  };

  // resolve the component
  var component;
  try {
    component = require('../../app/node_modules/components/' + componentName);
  } catch (e) {
    res.write('<!-- Component "' + componentName + '" not found! -->');
    res.end();
    return;
  }

  // see if there is a data wrapper
  // var wrapper;

  // try {
  //   wrapper = require('../../app/node_modules/components/' + componentName + '/wrapper');
  // } catch (e) {
  //   // not found (is okay, continue)
  // }

  // wrap component in isomorphic layer
  // injects data to DOM and attaches component id
  // component re-rendered client-side via app/client.js
  var iso = new Iso();
  var isoWrapped = iso.wrap({
    component: component,
    state: state,
    meta: { id: camelCase(componentName), variation: componentVariation }
  });

  res.send(isoWrapped);
};
