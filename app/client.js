var React = require('react');

var Iso = require('higher-order/iso');
var Demo = require('demo/article');

var isos = document.querySelectorAll('.az-iso-item');

for (var i = 0, len = isos.length; i < len; i++) {
  var iso = isos[i];
  // var data = iso.querySelector('.az-iso-data').getAttribute('data-az-iso');
  var el = React.createElement(Demo);
  React.render(el, iso);
}
