/* eslint-disable no-unused-vars */


/**
 * A middleware to load the the domain config.
 */
function loadDomain(req, res, next) {
  var domainName = req.headers['x-skin'] || 'aaz';

  var apiConfig = {
    endpoint: '/content/domains/'+ domainName,
    key: 'domain'
  };

  req.api.retrieve(apiConfig);

  next();
}

module.exports = loadDomain;
