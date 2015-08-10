/* eslint-disable no-unused-vars */
/**
 * Loads the article with id `req.params.articleId` and stores it in
 * `req.api.article`.
 */
function loadArticle(req, res, next) {
  var apiConfig = {
    endpoint: '/published_news_articles/' + req.params.articleId,
    key: 'article'
  };

  req.api.retrieve(apiConfig, function(err, article) {
    //
  });

  next();
}


module.exports = loadArticle;
