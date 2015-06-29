var React = require('react');

var Iso = require('../../app/node_modules/higher-order/isomorphic');
var Component = require('../../app/node_modules/demo/article');

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
  var element = React.createElement(Component, articleData);
  var iso = React.createElement(Iso, { data: articleData }, element);
  res.send(React.renderToString(iso));
};
