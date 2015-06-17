'use strict';

module.exports = function(app) {
  app.param('articleId', function(req, res, next, id) {
    app.models.PublishedNewsArticle.get(id, function(err, article) {
      if (err) {
        next(err);
      } else if (article) {
        req.item = article;
        next();
      } else {
        next('Article "' + id + '" not found!');
      }
    });
  });
};
