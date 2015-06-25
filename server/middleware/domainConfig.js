module.exports = function(app) {
  // hook into all requests
  // -> loads the domain configuration from the REST API
  // -> attaches the domain configuration to the request
  app.use('/', function(req, res, next) {
    // until it is assured that the request header 'X_ZOPE_SKIN' is set, use a default
    var domainId = req.get('X_ZOPE_SKIN') || 'aaz';
    app.models.Domain.get(domainId, function(err, domain) {
      if (err) {
        next(err);
      } else if (domain) {
        req.domainConfig = domain;
        next();
      } else {
        next('Domain Config not found.');
      }
    });
  });
};
