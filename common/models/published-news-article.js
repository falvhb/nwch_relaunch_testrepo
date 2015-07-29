module.exports = function(PublishedNewsArticle) {
  PublishedNewsArticle.query = function(data, cb) {
    this.queryPublishedNewsArticle(
      data.keywords,
      data.domain,
      data.limit,
      data.offset,
      function(err, articles) {
        cb(err, articles);
      });
  };
};
