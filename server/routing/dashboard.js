var getSkinName = require('../modules/skin');
var getIconPath = require('../modules/icon-path');
var DomainVariations = require('../../app/node_modules/config/domain-variations');
var getAssetPath = require('../../app/node_modules/helpers/get-asset-path');

module.exports = function(req, res) {
  var skin = getSkinName(req);

  res.render('layouts/dashboard.html', {
    staticBasePath: process.env.STATIC_ASSETS,
    iconPath: getIconPath(skin),
    skin: skin,
    logoPath: getAssetPath('client/images/logos' + DomainVariations[skin].logo)
  });
};
