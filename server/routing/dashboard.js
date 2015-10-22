var getSkinName = require('../modules/skin');
var getIconPath = require('../modules/icon-path');

module.exports = function(req, res) {
  var skin = getSkinName(req);
  var version = process.env.VERSION || '@@VERSION';
  res.render('layouts/dashboard.html', {
    staticBasePath: '/__node__/' + version + '/__static__',
    iconPath: getIconPath(skin),
    skin: skin
  });
};
