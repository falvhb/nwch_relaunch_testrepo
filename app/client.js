var React = require('react');

var Demo = require('demo/article');
var Container = require('components/container');

var Iso = require('iso');
var iso = new Iso();

var allComponents = {
  demo: Demo,
  container: Container
}

// iso.hydrate();


var isos = document.querySelectorAll('.az-iso');

for (var i = 0, len = isos.length; i < len; i++) {
  var iso = isos[i];
  var wrapper = iso.querySelector('.az-iso-component');
  var component = JSON.parse(iso.getAttribute('data-meta')).id;
  var state = JSON.parse(iso.querySelector('.az-iso-state').getAttribute('data-state'));
  var el = React.createElement(allComponents[component], state);
  React.render(el, wrapper);
}
