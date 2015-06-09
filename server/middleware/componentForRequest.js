'use strict';

var _ = require('lodash');
var slugify = require('slugify');

module.exports = function(request, components) {
  var component, variationIndex;
  var componentId = request.component;
  var variationId = request.variation;

  // Find requested component
  component = _.find(components, function(chr) {
    return chr.slug === componentId;
  });

  // Find requested variation
  if (variationId || component.variations) {
    // Get index of variation
    variationIndex = _.findIndex(component.variations, function(chr) {
      return slugify(chr.title).toLowerCase() === variationId;
    });
    // Default to first component
    if (variationIndex === -1) {
      variationIndex = 0;
    }
  }

  // Attach and return
  component.variationIndex = variationIndex;
  return component;
};
