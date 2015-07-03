var _ = require('lodash');
var slugify = require('slugify');

module.exports = function(request, components) {
  var component, variationIndex = 0;
  var componentSlug = request.component;
  var variationSlug = request.variation;

  // Find requested component
  component = _.find(components, function(chr) {
    return chr.slug === componentSlug;
  });

  // Find requested variation
  if (variationSlug && component.variations) {
    // Get index of variation
    variationIndex = _.findIndex(component.variations, function(chr) {
      return slugify(chr.title).toLowerCase() === variationSlug;
    });
    // Default to first component
    if (variationIndex === -1) {
      variationIndex = 0;
    }
  }

  // If showing component, attach variation
  if (component && component.variations) {
    component.variationIndex = variationIndex;
  }

  return component;
};
