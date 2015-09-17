/* eslint-disable no-unused-vars */

var Qs = require('qs');
var ressortPath = require('../modules/ressortPath');
var getSkinName = require('../modules/skin');

var DAYS_NON_RESSORT = 90;


/**
 * A middleware to load data for an RSS Feed.
 */
function loadRss(req, res, next) {
  var domain = getSkinName(req);
  var queryParams = {
    'domain': domain,
    sort: 'newest'
  };
  var rsPath = ressortPath(req);
  if (!rsPath) {
    rsPath = '';
    // limit the number of days because of performance
    queryParams.days = DAYS_NON_RESSORT;
  }
  var apiConfig = {
    endpoint: '/rss/' + rsPath + '?' + Qs.stringify(queryParams),
    key: 'rss2'
  };

  req.api.retrieve(apiConfig);
  next();
}


module.exports = loadRss;

