/* eslint-disable no-unused-vars */
var getSkinName = require('../modules/skin');

/**
 * A middleware to load the the domain config.
 */
function loadDomain(req, res, next) {
  var domainName = getSkinName(req, true);

  var apiConfig = {
    endpoint: '/content/domains/'+ domainName,
    key: 'domain'
  };

  req.api.retrieve(apiConfig);

  next();
}

module.exports = loadDomain;
