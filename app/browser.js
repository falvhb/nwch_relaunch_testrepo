/*eslint-disable no-console */
'use strict';

var React = require('react');
var Styleguide = require('styleguide/layout');
var StyleguideFull = require('styleguide/layout-full');

var objectAssign = require('react/lib/Object.assign');

var isFullView = function(path) {
  var suffix = '/full';
  return path.indexOf(suffix, path.length - suffix.length) !== -1;
};

var createProps = function(components) {
  // Get current route
  var url = window.location.href;
  var cleanUrl = url.replace(/\/$/, '');
  if (isFullView(cleanUrl)) {
    cleanUrl = cleanUrl.replace('/full', '');
  }
  var slug = cleanUrl.split('/component/').pop();
  var route = cleanUrl === slug ? null : slug;
  // Return props
  return {
    components: components,
    route: route
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
  var view = Styleguide;
  var url = window.location.href;
  var cleanUrl = url.replace(/\/$/, '');
  if (isFullView(cleanUrl)) {
    cleanUrl = cleanUrl.replace('/full', '');
    view = StyleguideFull;
  }
  renderReact({
    view: view,
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
