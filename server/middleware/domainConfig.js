var app = require('../server');

module.exports = function(req, cb) {
  if (!req.domainConfig) {
    // until it is assured that the request header 'X_ZOPE_SKIN' is set, use a default
    var domainId = req.get('X_ZOPE_SKIN') || 'aaz';
    app.models.Domain.get(domainId, function(err, domain) {
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
};
