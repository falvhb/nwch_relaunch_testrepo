/*eslint-disable no-console */
'use strict';

var React = require('react');
var _ = require('lodash');

var slugify = require('slugify');
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

// Render for react
var Layout = require('styleguide/layout');
var LayoutFull = require('styleguide/layout-full');

var renderReact = function(params) {

  // Define layout
  var layout = params.full ? LayoutFull : Layout;

  // Create element to be passed as child
  var child, el, app = document.getElementById('app');
  require.ensure([], function(require) {
    // Ensure requiring of routed component
    if (params.component) {
      var module = require('components/' + params.component.slug + '/index.jsx');
      child = React.createElement(module);
    }
    // Create our styleguide
    el = React.createElement(layout, objectAssign({}, params), child);
    React.render(el, app);
  }, 'components');
};

var componentForRequest = function(request, components) {
  var component, variation;
  var componentId = request.component;
  var variationId = request.variation;

  // Find requested component
  component = _.find(components, function(chr) {
    return chr.slug === componentId;
  });

  // Get our variation, defaulting to the first
  if (variationId || component.variations) {
    variation = _.find(component.variations, function(chr) {
      return slugify(chr.title).toLowerCase() === variationId;
    }) || component.variations[0];
  }

  // Attach and return
  component.variation = variation;
  return component;
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
