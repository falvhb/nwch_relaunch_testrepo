module.exports = function(NewsRessort) {
  NewsRessort.query = function(data, cb) {
    this.queryNewsRessort(
      data.path,
      function(err, newsRessort) {
        cb(err, newsRessort);
      });
  };
};
