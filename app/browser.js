/*eslint-disable no-console */
'use strict';

var React = require('react');
var Styleguide = require('styleguide/layout');
var objectAssign = require('react/lib/Object.assign');

var renderReact = function(components) {
  var props = {
    components: components
  };
  var rootElement = document.getElementById('app');
  var reactEl = React.createElement(Styleguide, objectAssign({}, props));
  React.render(reactEl, rootElement);
};

// Parse list of all components on the client-side, then render
fetch('/components.json')
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    renderReact(json);
  }).catch(function(ex) {
    console.log('Error parsing components Json', ex);
  });
