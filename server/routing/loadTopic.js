/* eslint-disable no-unused-vars */

var Qs = require('qs');
var getSkinName = require('../modules/skin');

/**
 * Loads articles based on their keywords.
 */
function loadTopic(req, res, next) {
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page <= 0) {
    page = 0;
  }

  var queryParams = {
    'keywords': req.params.topicKeyword,
    'domain': getSkinName(req),
    'offset': page * process.env.PAGINATED,
    'limit': process.env.PAGINATED,
  };

  var apiConfig = {
    endpoint: '/content/published_news_articles?' + Qs.stringify(queryParams),
    key: 'topic'
  };

  req.api.retrieve(apiConfig);

  next();
}


module.exports = loadTopic;
