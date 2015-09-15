/* eslint-disable no-console */
var React = require('react');

/**
 * A middleware to load the videos.
 */
function routingVideos(req, res) {

  // create properties object
  var props = {
    initialVideos: res.video.videoData,
    accountID: '1719221',
    playerID: '29383891',
    playerWithoutAdsID: '29381931',
    categoryId: '23690341',
    pageSize: 12,
    initialTotalCount: res.video.videoCount,
  };

  var el = React.createElement(res.video.component, props, null);
  var output = React.renderToString(el);

  res.send('<div id="myTarget">'+output+'</div>');
}

module.exports = routingVideos;
