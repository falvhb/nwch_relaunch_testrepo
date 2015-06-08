'use strict';

var React = require('react');
var objectAssign = require('react/lib/Object.assign');
var slugToTitle = require('slug-to-title');
var componentForRequest = require('./componentForRequest');

module.exports = function() {

  var renderReact = function(params) {

    // Define layout
    var layout;
    if (params.full) {
      layout = require('../../app/node_modules/styleguide/layout-full');
    } else {
      layout = require('../../app/node_modules/styleguide/layout');
    }

    // Create element to be passed as child
    var child, elData;
    var component = params.component;
    if (component) {
      var module = '../../app/node_modules/components/' + component.slug;
      // Attach data to component
      if (component.variations) {
        elData = component.variations[component.variationIndex].data;
      }
      child = React.createElement(require(module), objectAssign({}, elData));
    }

    // Create our styleguide
    var el = React.createElement(layout, objectAssign({}, params), child);
    return React.renderToString(el);
  };

  return function(req, res) {
    res.render('layouts/styleguide.html', {
      title: req.params.component ? slugToTitle(req.params.component) + ' | AZ Medien Styleguide' : 'AZ Medien Styleguide',
      content: renderReact({
        components: res.locals.components,
        component: req.params.component ? componentForRequest(req.params, res.locals.components) : false,
        full: (req.url.indexOf('full') > -1)
      })
    });
  };

};
