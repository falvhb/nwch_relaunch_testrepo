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
  var apiConfig = {
    endpoint: '/news_ressorts/' + req.params.ressort + '/subressorts?domain=' + domain,
    key: 'ressortnav'
  };
  req.api.retrieve(apiConfig);
  next();
}

module.exports = loadRessortNav;
