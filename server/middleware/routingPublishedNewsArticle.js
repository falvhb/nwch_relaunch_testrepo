var React = require('react');
var objectAssign = require('react/lib/Object.assign');

module.exports = function(req, res, next) {
  // resolve the component
  var component = require('../../app/node_modules/components/' + req.params.component);
  if (!component) {
    next();
    return;
  }

  var componentData = req.item.data;
  var element = React.createElement(component,
                                    objectAssign({}, componentData),
                                    {} /*variations*/);
  res.write(React.renderToString(element));
  res.end();
};
