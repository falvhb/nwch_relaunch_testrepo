/* eslint-disable no-unused-vars */

var Qs = require('qs');
var ressortPath = require('../modules/ressortPath');
var moment = require('moment');

var ITEMS_LIMIT = 20;


/**
 * A middleware to load the RSS Feed.
 */
function loadRss(req, res, next) {
  var domain = req.headers['x-skin'] || 'aaz';
  var effective = moment().utc().subtract(10, 'days').format();
  var queryParams = {
    limit: ITEMS_LIMIT,
    effective: effective,
    sort: 'newest'
  };
  var rsPath = ressortPath(req);
  if (rsPath) {
    // only set a ressort filter if it is actually required.
    queryParams.ressort = rsPath;
  }

  var apiConfig = {
    endpoint: '/rss/' + domain + '?' + Qs.stringify(queryParams),
    key: 'rss2'
  };

  req.api.retrieve(apiConfig);
  next();
}


module.exports = loadRss;

