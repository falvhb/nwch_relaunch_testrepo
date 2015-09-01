var loadDossier = require('../api/loadDossier');

/**
 * A middleware to load the the dossier data.
 *
 * req.params.dossier: dossier name
 */
module.exports = function(req, res, next) {
  loadDossier(req, res);

  // signal that we need to wait for the API to finish the request
  next();
};
