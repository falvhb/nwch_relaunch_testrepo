/*eslint-disable no-warning-comments*/
var path = require('path');

var defaults = {
  folder: './app/includes'
};

var nunjucks = require('nunjucks');

function renderNunchuck(component, data) {
  var templateSlug = component && component.toLowerCase() || '';
  var template = path.join(defaults.folder, templateSlug + '.html');
  return nunjucks.render(template, data);
}

module.exports = function nodeIncludesRouter(req, res) {
  var component = req.params.viewname;
  var pageType = 'home';
  var parts = [];
  ['a', 'b', 'c', 'd', 'e'].forEach(function(v) {
    if (req.params[v]) {
      parts.push(req.params[v]);
    }
  });
  if (parts.length) {
    if ((req.params.a === 'publireportage') || (req.params.b === 'publireportage')) {
      // special case without ads
      pageType = '';
    } else {
      var requestPath = path.join.apply(null, parts);
      if (requestPath.match(/^([^\\/]+?)(?:\/([^\\/]+?))?\/([^\\/]+?)-(\d+)(?:\/(?=$))?$/i)) {
        pageType = 'artikel';
      } else if (requestPath.match(/^([^\\/]+?)(?:\/([^\\/]+?))?(?:\/(?=$))?$/i)) {
        pageType = 'ressort';
      }
    }
  }
  var skin = req.headers ? req.headers['x-skin'] : 'aaz';
  var iconPath = 'az';
  if (skin.match(/^(bzb|blz)$/)) {
    iconPath = 'bz';
  } else if (skin.match(/^(ot)$/)) {
    iconPath = 'ot';
  }
  var version = process.env.VERSION || '@@VERSION';
  var data = {
    'withAds': pageType !== '',
    'pageType': pageType,
    'skin': skin,
    'iconPath': iconPath,
    'staticBasePath': '/__node__/' + version + '/__static__'
  };
  res.send(renderNunchuck(component, data));
};

