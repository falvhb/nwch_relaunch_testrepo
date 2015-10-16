var getSkinName = require('../modules/skin');

module.exports = function(req, res) {
  var skin = getSkinName(req);
  var iconPath = 'az';
  if (skin.match(/^(bzb|blz)$/)) {
    iconPath = 'bz';
  } else if (skin.match(/^(ot)$/)) {
    iconPath = 'ot';
  }
  var version = process.env.VERSION || '@@VERSION';
  res.render('layouts/dashboard.html', {
    staticBasePath: '/__node__/' + version + '/__static__',
    iconPath: iconPath,
    skin: skin
  });
};
