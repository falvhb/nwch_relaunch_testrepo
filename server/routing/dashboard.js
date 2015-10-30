var path = require('path');
var getSkinName = require('../modules/skin');
var getIconPath = require('../modules/icon-path');
var DomainVariations = require('../../app/node_modules/config/domain-variations');

module.exports = function(req, res) {
  var skin = getSkinName(req);
  var version = process.env.VERSION || '@@VERSION';
  var staticBasePath = '/__node__/' + version + '/__static__';

  res.render('layouts/dashboard.html', {
    staticBasePath: staticBasePath,
    iconPath: getIconPath(skin),
    skin: skin,
    logoPath: path.join(staticBasePath, 'client/images/logos', DomainVariations[skin].logo)
  });
};
