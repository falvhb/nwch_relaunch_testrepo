var getSkinName = require('../modules/skin');

module.exports = function(req) {
  /**
   * Trigger the API call to load data for the ressort navigation header.
   *
   * Uses req.api to activate the request.
   */
  var domain = getSkinName(req);
  var ressortName = req.params.ressort;
  var apiConfig = {
    endpoint: '/content/news_ressorts/' + ressortName + '/subressorts?domain=' + domain,
    key: 'ressortnav'
  };
  req.api.retrieve(apiConfig);
};
