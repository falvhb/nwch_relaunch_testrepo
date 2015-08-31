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
    endpoint: '/content/news_ressorts?' + Qs.stringify(queryParams),
    key: 'dossier'
  };

  req.api.retrieve(apiConfig, function(err, dossier) {
    // retrieve the related keywords
    if (err) {
      return;
    }
    var keywords = dossier.data[0].keywords;
    if (!keywords) {
      return;
    }
    queryParams = {
      'keywords': keywords.join(','),
      'domain': req.headers['x-skin'] || 'aaz'
    };
    apiConfig = {
      endpoint: '/keywords/related?' + Qs.stringify(queryParams),
      key: 'related_keywords'
    };
    req.api.retrieve(apiConfig);
  });

  next();
}


module.exports = loadDossier;
