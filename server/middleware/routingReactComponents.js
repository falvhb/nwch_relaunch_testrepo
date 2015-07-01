var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {

  var iso = new Iso();
  var article = req.item.data;
  var componentName = req.params.component;
  // var componentVariation = req.params.variation;

  // resolve the component
  var component = require('../../app/node_modules/components/' + componentName+ '/wrapper');

  if (!article) {
    res.write('<!-- Article "' + req.params.articleId + '" not found! -->\n');
    var errors = req.item.errors;
    if (errors && errors.length > 0) {
      res.write('<!-- Error detail: ' + errors[0].detail + ' -->\n');
    }
    res.end();
    return;
  }

  if (!component) {
    res.write('<!-- Component "' + componentName + '" not found! -->');
    res.end();
    return;
  }

  // var data = {
  //   "article": article,
  //   "variation": componentVariation
  // }

  // var element = React.createElement(component, article);

  var isoWrapped = iso.wrap({
    component: component,
    state: article,
    meta: { id: camelCase(componentName) }
  });

  res.send(isoWrapped);
};
