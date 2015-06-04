/*eslint-disable no-console */
'use strict';

var React = require('react');
var Styleguide = require('styleguide/layout');
var objectAssign = require('react/lib/Object.assign');

var renderReact = function(components) {
  // Get current route
  var url = window.location.href;
  var slug = url.split('/component/').pop();
  var route = url === slug ? null : slug;
  // Set props
  var props = {
    components: components,
    route: route
  };

  // console.log(props.components[0].title);
  // console.log(Object.getOwnPropertyDescriptor(props.components[0].title));

  // Create element to be passed as child
  var reactEl, children, appElement = document.getElementById('app');
  require.ensure([], function(require) {
    if (route) {
      // Set required component
      var requiredComponent = require('components/' + route + '/index.jsx');
      children = React.createElement(requiredComponent);
    }
    // Create our styleguide
    reactEl = React.createElement(Styleguide, objectAssign({}, props), children);
    // Render it
    React.render(reactEl, appElement);
  }, 'components');
};

// Parse all components client-side, then render
fetch('/components.json')
  .then(function(response) {
    return response.json();
  })
  .then(renderReact)
  .catch(function(ex) {
    console.log('Error parsing components', ex);
  });
