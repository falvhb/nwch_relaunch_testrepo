/* eslint-disable no-unused-vars */
var Qs = require('qs');
var getSkinName = require('../modules/skin');

var variations = {
  news: 'newsarticle',
  ugc: 'ugcnewsarticle'
};

/**
 * A middleware to load the the latest articles
 * based on the variation passed to the node view
 */
function loadLatestArticles(req, res, next) {

  var variation = req.params.variation;

  var queryParams = {
    'domain': getSkinName(req),
    'limit': 9,
  };

  if (variations[variation]) {
    queryParams.content_type = variations[variation];
  }

  var apiConfig = {
    endpoint: '/content/published_news_articles?' + Qs.stringify(queryParams),
    key: 'latestarticles'
  };

  req.api.retrieve(apiConfig);

  next();
}

module.exports = loadLatestArticles;
