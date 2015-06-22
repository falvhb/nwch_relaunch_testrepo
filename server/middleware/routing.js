'use strict';

var React = require('react');
var objectAssign = require('react/lib/Object.assign');
var slugToTitle = require('slug-to-title');
var path = require('path');
var componentForRequest = require('./componentForRequest');

module.exports = function() {

  var renderReact = function(params) {
    var defaults = {
      folder: '../../app/node_modules',
      base: 'styleguide',
    };

    // Define layout
    var layout, requirePath = path.join(defaults.folder, defaults.base);
    if (params.preview) {
      requirePath = path.join(requirePath, 'layout-preview');
      layout = require(requirePath);
    } else {
      requirePath = path.join(requirePath, 'layout');
      layout = require(requirePath);
    }

    // Create element to be passed as child
    var child;
    var component = params.component;
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
      // Attact data/variations and create component
      var module = path.join(defaults.folder, component.category, component.slug);
      child = React.createElement(require(module), objectAssign({}, data, variations));
    }
    // Create our styleguide
    var el = React.createElement(layout, objectAssign({}, params), child);
    return React.renderToString(el);
  };

  return function(req, res) {
    res.render('layouts/styleguide.html', {
      title: (req.params.component ? slugToTitle(req.params.component) + ' | ' : '') + 'AZ Medien Styleguide',
      content: renderReact({
        components: res.locals.components,
        component: componentForRequest(req.params, res.locals.components),
        preview: (req.url.indexOf('preview') > -1)
      })
    });
  };

};
