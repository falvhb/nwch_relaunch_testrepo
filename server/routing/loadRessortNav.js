/* eslint-disable no-unused-vars */

var Qs = require('qs');

/**
 * A middleware to load the the ressort navigation data.
 *
 * req.params.ressort:
 *   ressort navigation to load
 */
function loadRessortNav(req, res, next) {
  var domain = req.headers['x-skin'] || 'aaz';
  var ressortName = req.params.ressort;
  if (req.params.subressort) {
    ressortName += ',' + req.params.subressort;
  }
  var apiConfig = {
    endpoint: '/content/news_ressorts/' + ressortName + '/subressorts?domain=' + domain,
    key: 'ressortnav'
  };
  req.api.retrieve(apiConfig);
  next();
}

module.exports = loadRessortNav;
