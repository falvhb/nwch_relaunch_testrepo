module.exports = function(Domain) {
  Domain.fromRequest = function(req, cb) {
    if (!req.domainConfig) {
      var domainId = req.get('X_ZOPE_SKIN') || 'aaz';
      Domain.get(domainId, function(err, domain) {
        if (err) {
          cb(err, undefined);
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
