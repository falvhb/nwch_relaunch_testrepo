var loadRessortNav = require('../api/loadRessortNav');

/**
 * A middleware to load the the ressort navigation data.
 *
 * req.params.ressort:
 *   ressort navigation to load
 */
module.exports = function(req, res, next) {
  loadRessortNav(req, res);

  // signal that we need to wait for the API to finish the request
  next();
};
