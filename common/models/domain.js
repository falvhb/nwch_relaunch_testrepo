module.exports = function(Domain) {
  // loads the domain configuration via the API if it wasn't already loaded
  // this method stores the retrieved domain configuration in the request
  Domain.fromRequest = function(req, cb) {
    if (!req.domainConfig) {
      var domainId = req.get('X_ZOPE_SKIN') || 'aaz';
      Domain.get(domainId, function(err, domain) {
        if (err) {
          cb(err);
        } else {
          req.domainConfig = domain;
          cb(null, req.domainConfig);
        }
      });
    } else {
      cb(null, req.domainConfig);
    }
  }
};
