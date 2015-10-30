/* eslint-disable no-unused-vars */

/**
 * Loads the article with id `req.params.articleId` and stores it in
 * `req.api.article`.
 */
function loadArticle(req, res, next) {
  var apiConfig = {
    endpoint: '/content/published_news_articles/' + req.params.articleId,
    key: 'article'
  };

  req.api.retrieve(apiConfig);

  next();
}


module.exports = loadArticle;
