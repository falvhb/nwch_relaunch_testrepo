var getSkinName = require('../modules/skin');

module.exports = function(req) {
  /**
   * Trigger the API call to load data for the domain.
   *
   * Uses req.api to activate the request.
   */
  var domain = getSkinName(req);

  var parish = domain === 'aaz' ? 1 : 300;
  var apiConfig = {
    endpoint: '/weather/3h?city='+ parish,
    key: 'weather'
  };
  // console.log(apiConfig.endpoint);
  req.api.retrieve(apiConfig);
};
