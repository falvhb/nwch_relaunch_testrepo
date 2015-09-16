/* eslint-disable no-unused-vars */

var Qs = require('qs');
var getSkinName = require('../modules/skin');

/**
 * Loads a dossier.
 */
module.exports = function loadDossier(req, res) {
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page < 0) {
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
      'domain': getSkinName(req)
    };
    apiConfig = {
      endpoint: '/keywords/related?' + Qs.stringify(queryParams),
      key: 'related_keywords'
    };
    req.api.retrieve(apiConfig);
  });
};
