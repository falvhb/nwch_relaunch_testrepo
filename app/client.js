var React = require('react');
var Iso = require('iso');

var Demo = require('demo/article');

Iso.bootstrap(function(data, meta, node) {
  var element = React.createElement(Demo, data);
  React.render(element, node);
});
