/*eslint-disable no-console */
'use strict';

var React = require('react');
var _ = require('lodash');
var objectAssign = require('react/lib/Object.assign');

var parseUrl = (function() {
  var prefixes = 'styleguide/component'.split('/');
  var suffix = 'full';
  // Remove trailing slash and make array
  var urlParts = window.location.href.replace(/\/$/, '').split('/');
  // Remove first 3 url parts
  urlParts = urlParts.splice(3);
  // Diff prefixes with found parts
  var paths = _.difference(urlParts, prefixes);
  return {
    component: paths.length ? paths[0] : false,
    variation: paths.length > 1 && paths[1] !== suffix ? paths[1] : false,
    full: paths[paths.length - 1] === suffix ? true : false
  };
}());

// Middleware
var componentForRequest = require('../server/middleware/componentForRequest');

// Render for react
var Layout = require('styleguide/layout');
var LayoutFull = require('styleguide/layout-full');

var renderReact = function(params) {

  // Define layout
  var layout = params.full ? LayoutFull : Layout;

  // Create element to be passed as child
  var child, elData, el, app = document.getElementById('app');
  var component = params.component;
  require.ensure([], function(require) {
    // Ensure requiring of routed component
    if (component) {
      var module = require('components/' + component.slug + '/index.jsx');
      // Attach data to component
      if (component.variations) {
        elData = component.variations[component.variationIndex].data;
      }
      child = React.createElement(module, objectAssign({}, elData));
    }
    // Create our styleguide
    el = React.createElement(layout, objectAssign({}, params), child);
    React.render(el, app);
  }, 'components');
};

var renderPage = function(components) {
  renderReact({
    components: components,
    component: componentForRequest(parseUrl, components),
    full: parseUrl.full
  });
};

// Parse all components client-side, then render
fetch('/components.json')
  .then(function(response) {
    return response.json();
  })
  .then(renderPage)
  .catch(function(ex) {
    console.log('Error parsing components', ex);
  });
