var Components = require('../modules/components.js');


module.exports = function(componentName) {
  /**
   * Express middleware which allows a component to preload data before it is
   * finally executed.
   *
   * Tries to load the "api" of the component and calls it with the request
   * and response object.
   * This way a component has the chance to trigger API calls before the
   * components rendering will be done.
   *
   * The middleware can be configured for a fixed "componentName" or if the
   * parameter is not provided it uses the "componentName" property from
   * req.params.
   */
  return function(req, res, next) {
    var cn = componentName;
    if (!cn) {
      // name not provided as a parameter, get it from the request
      var c = new Components(req);
      cn = c.componentName;
    }
    if (!cn) {
      res.send('<!-- No component name provided! -->');
      next(400);
      return;
    }
    // Here we try to get the api module of the component.
    var api;
    try {
      api = require('../../app/node_modules/components/' + cn + '/api');
    } catch (e) {
      // not found (is okay)
      next();
      return;
    }
    if (api(req, res)) {
      // wait for the API calls to finish
      req.api.done(function() {
        next();
      });
    } else {
      // component did no API calls, go ahead
      next();
    }
  };
};
