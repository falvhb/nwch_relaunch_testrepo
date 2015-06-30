var React = require('react');

var Iso = require('../../app/node_modules/iso');
var Container = require('../../app/node_modules/components/container');

module.exports = function(req, res) {
  /*
   * A dummy function which does the following:
   *  - Get the article from the API for given 'articleId'
   *  - Renders an Article componet.
   */
  // articleId is resolved by 'middleware/routingParams.js'. Therefore, the
  // response of the "Article API endpoint" is on req.item.
  // The actual article data is in req.item.data

  var iso = new Iso();
  var data = {
    title: 'Testing1234'
  };
  var element = React.createElement(Container, data);
  // res.send();
  res.render('iso.html', {
    title: 'Iso Rendering',
    content: iso.render(React.renderToString(element), data, { component: 'container' })
  });
};
