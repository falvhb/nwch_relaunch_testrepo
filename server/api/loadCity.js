module.exports = function(req) {
  /**
   * Trigger the API call to load a city.
   *
   * Uses req.api to activate the request.
   */
  var apiConfig = {
    endpoint: '/content/cities/' + req.params.city_id,
    key: 'city'
  };
  // console.log(apiConfig.endpoint);
  req.api.retrieve(apiConfig);
};
