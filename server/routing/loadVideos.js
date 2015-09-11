/* eslint-disable no-unused-vars */
var React = require('react');
// var camelCase = require('camelcase');
// var Iso = require('../../app/node_modules/iso-react');
var Components = require('../modules/components');
var KalturaAPI = require('../../app/node_modules/helpers/kaltura-api');


/**
 * A middleware to load the videos.
 */
function loadVideos(req, res) {

  // get component from request
  var c = new Components(req);
  var component = c.getComponent(res);
  if (!component) {
    return;
  }
  if (!c.variationName) {
    return;
  }
  var slot = c.slot();

  // get data from request
  var videoData = null;
  var kalturaAPI = new KalturaAPI({

  });
  // if (req.video) {
  //   videoData = req.video.data;
  // }

  var el = React.createElement(component, {});
  var output = React.renderToString(el, {}, {});

  res.send('<div id="myTarget">'+output+'</div>');
}

module.exports = loadVideos;
