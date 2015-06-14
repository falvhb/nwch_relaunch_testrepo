'use strict';

var _ = require('lodash');
var slugify = require('slugify');

module.exports = function(request, components) {
  var component, variationIndex;
  var categorySlug = request.category;
  var componentSlug = request.component;
  var variationSlug = request.variation;

  // Find requested component
  component = _.find(components[categorySlug], function(chr) {
    return chr.slug === componentSlug;
  });

  // // Find requested variation
  if (variationSlug || component.variations) {
    // Get index of variation
    variationIndex = _.findIndex(component.variations, function(chr) {
      return slugify(chr.title).toLowerCase() === variationSlug;
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
