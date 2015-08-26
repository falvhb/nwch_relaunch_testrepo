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
    var result = req.api.get('topic');
    if (!result) {
      result = {"data": [],
                "total": 0,
                "query": {}
               };
    }
    res.json(result);
  }

  render();
};
