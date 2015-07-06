/*eslint-disable no-console */

var React = require('react');
var _ = require('lodash');
var path = require('path');
var objectAssign = require('react/lib/Object.assign');
var recursiveUnescape = require('recursive-unescape');

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

var parseUrl = (function() {
  var suffix = 'preview';
  // Remove trailing slash and make array
  var urlParts = window.location.href.replace(/\/$/, '').split('/');
  // Remove first 3 url parts
  urlParts = urlParts.splice(3);
  // Diff prefixes with found parts
  var paths = _.difference(urlParts, ['styleguide']);
  return {
    category: paths[0],
    component: paths[1],
    variation: paths.length > 2 && paths[2] !== suffix ? paths[2] : null,
    preview: paths[paths.length - 1] === suffix || false
  };
}());


// -----------------------------------------------------------------------------
// React Render
// -----------------------------------------------------------------------------

var Layout = require('styleguide/layout');
var LayoutPreview = require('styleguide/layout-preview');
var componentForRequest = require('../server/styleguide/componentForRequest');

var renderReact = function(params) {

  // Define layout
  var layout = params.preview ? LayoutPreview : Layout;

  // Create element to be passed as child
  var child, el, app = document.getElementById('app');
  var component = params.component;
  require.ensure([], function(require) {
    // Ensure requiring of routed component
    if (component) {
      var data, variations;
      // Component data (from .data.json)
      if (component.data) {
        data = component.data;
      }
      // Component variations (from .variations.json)
      if (component.variations) {
        variations = component.variations[component.variationIndex].data;
      }
      var requirePath = path.join(component.category, component.slug);
      var module = require(requirePath + '/index.jsx');
      child = React.createElement(module, objectAssign({}, data, variations));
    }
    // Create our styleguide
    el = React.createElement(layout, objectAssign({}, params), child);
    React.render(el, app);
  }, 'components');
};

var renderPage = function(components) {
  components = recursiveUnescape(components);

  renderReact({
    components: components,
    component: componentForRequest(parseUrl, components),
    preview: parseUrl.preview
  });
};


// -----------------------------------------------------------------------------
// Get Json then render
// -----------------------------------------------------------------------------

var xhr = new XMLHttpRequest();
xhr.open('GET', '/styleguide/components.json');
xhr.responseType = 'json';

xhr.onload = function() {
  renderPage(xhr.response);
};

xhr.onerror = function() {
  console.log('Error parsing components', xhr.response);
};

xhr.send();
