var getSkinName = require('../modules/skin');

module.exports = function(req) {
  /**
   * Trigger the API call to load data for the domain.
   *
   * Uses req.api to activate the request.
   */
  var domain = getSkinName(req);

  var apiConfig = {
    endpoint: '/content/cities?domain=aaz'+ domain,
    key: 'cities'
  };
  // console.log(apiConfig.endpoint);
  req.api.retrieve(apiConfig);
};
