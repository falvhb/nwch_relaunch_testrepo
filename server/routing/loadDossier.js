/* eslint-disable no-unused-vars */

var Qs = require('qs');

/**
 * Loads a dossier.
 */
function loadDossier(req, res, next) {
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page <= 0) {
    page = 0;
  }

  var queryParams = {
    'path': 'dossier/' + req.params.dossier
  };

  var apiConfig = {
    endpoint: '/news_ressorts?' + Qs.stringify(queryParams),
    key: 'dossier'
  };

  req.api.retrieve(apiConfig, function(err, topic) {
    //
  });

  next();
}


module.exports = loadDossier;
