module.exports = function(req, res) {
  /* Provide the topic data as json object
   *
   * Calls the article query API and returns the API result as JSON body.
   *
   * JSON response:
   *
   * {
   *     "data": [<articles>],
   *     "total": 35,
   *     "query": {<parameters used to build the result data>}
   * }
   */
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page <= 0) {
    page = 0;
  }

  function render() {
    var result = req.item;
    if (!result) {
      result = {"data": [],
                "total": 0,
                "query": {}
               };
    }
    res.json(result);
  }

  // Do the topic query
  var queryParams = {
    'keywords': req.params.topicKeyword,
    'domain': req.headers['x-skin'] || 'aaz',
    'offset': page * 12,
    'limit': 12,
  };
  req.app.models.PublishedNewsArticle.query(
    queryParams,
    function(err, result) {
      if (err) {
        // There was an error calling the API, we will render the page anyway
        // but without articles.
        req.item = null;
      } else {
        // got a result to render
        req.item = result;
      }
      render();
    }
  );
};
