var React = require('react');
var objectAssign = require('react/lib/Object.assign');
var component = require('../../app/node_modules/demo/article');
var Iso = require('iso');

module.exports = function(req, res) {
  /*
   * A dummy function which does the following:
   *  - Get the article from the API for given 'articleId'
   *  - Renders an Article component.
   */
  // articleId is resolved by 'middleware/routingParams.js'. Therefore, the
  // response of the "Article API endpoint" is on req.item.
  // The actual article data is in req.item.data
  var articleData = req.item.data;
  var element = React.createElement(component, objectAssign({}, articleData));
  var stringEl = React.renderToString(element);

  var iso = new Iso();
  iso.add(stringEl, articleData, { id: 'demo' });
  res.send(iso.render());
};
