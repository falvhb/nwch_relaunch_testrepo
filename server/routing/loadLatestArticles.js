/* eslint-disable no-unused-vars */
/**
 * Loads the latest articles
 */
function loadLatestArticles(req, res, next) {
  var apiConfig = {
    endpoint: '/content/published_news_articles?domain=aaz&limit=9',
    key: 'latestarticles'
  };

  req.api.retrieve(apiConfig);

  next();
}


module.exports = loadLatestArticles;
