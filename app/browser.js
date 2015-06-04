/*eslint-disable no-console */
'use strict';

var React = require('react');
var Styleguide = require('styleguide/layout');
var StyleguideFull = require('styleguide/layout-full');

var objectAssign = require('react/lib/Object.assign');

var urlChunks = (function() {
  return window.location.href.replace(/\/$/, '').split('/');
}());

var isFullView = function() {
  return urlChunks[urlChunks.length - 1] === 'full';
};

var computeView = function() {
  return isFullView() ? StyleguideFull : Styleguide;
};

var createProps = function(components) {
  var slug = urlChunks[urlChunks.length - (isFullView() ? 2 : 1)];
  return {
    components: components,
    route: slug === 'styleguide' ? null : slug
  };
};

var renderReact = function(params) {
  var props = createProps(params.components);
  // Create element to be passed as child
  var reactEl, children, appElement = document.getElementById('app');
  require.ensure([], function(require) {
    if (props.route) {
      // Set required component
      var requiredComponent = require('components/' + props.route + '/index.jsx');
      children = React.createElement(requiredComponent);
    }
    // Create our styleguide
    reactEl = React.createElement(params.view, objectAssign({}, props), children);
    // Render it
    React.render(reactEl, appElement);
  }, 'components');
};

var renderPage = function(components) {
  renderReact({
    view: computeView(),
    components: components
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
