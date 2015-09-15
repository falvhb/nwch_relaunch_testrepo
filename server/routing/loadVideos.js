/* eslint-disable no-unused-vars, no-console */
var React = require('react');
var Components = require('../modules/components');
var KalturaAPI = require('../../app/node_modules/helpers/kaltura-api');

// TEMP
var axios = require('axios');


/**
 * A middleware to load the videos.
 */
function loadVideos(req, res, next) {

  res.video = {};

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

  res.video.component = component;


  // get data from request
  var videoData;
  var videoCount;
  var kalturaAPI = new KalturaAPI({
    ssl: false,
    domain: 'www.aargauerzeitung.ch',
    path: '/__kaltura_api_proxy__',
    service: 'baseEntry',
    action: 'list',
    format: 1,
    orderByKey: 'createdAt',
    orderDescending: true,
    freeText: '',
    mediaTypeEqual: 1,
    categoriesIdsMatchAnd: '23690341',
    pageIndex: 0,
    pageSize: 12
  });

  // @TODO:@Richard: I get a 502 bad gateway - how can I get kalturaAPI to work?
  // kalturaAPI.getVideos().then(function(response) {
  //   res.video.videoData = response.data.objects;
  //   res.video.videoCount = response.data.totalCount;
  //   next();
  // }).catch((error) => {
  //   console.log(error.message);
  // });

  // load video data
  // using axios directly works
  var videoDataURL = kalturaAPI.getURL();
  axios.get(videoDataURL).then(function(response) {
    res.video.videoData = response.data.objects;
    res.video.videoCount = response.data.totalCount;
    next();
  }).catch(function(response) {
    console.log('error getting videos', response.message);
  });

}

module.exports = loadVideos;
