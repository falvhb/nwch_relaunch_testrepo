/*eslint-disable no-warning-comments*/
var path = require('path');
var getSkinName = require('../modules/skin');
var getIconPath = require('../modules/icon-path');
var Tracker = require('../../app/node_modules/tracking/tracker.jsx');

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
  function render() {
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
    var skin = getSkinName(req);

    var domain = req.api.get('domain') || {};
    var env = process.env;

    var without_wemf = (typeof domain.data !== 'undefined' ? domain.data.properties.without_wemf : false);
    var url_parts = req.originalUrl.split('/');
    var page_url = '/' + url_parts.slice(2, url_parts.length - 1).join('/');
    var netMetrixNoScript = '';

    if (!without_wemf) {
      netMetrixNoScript = Tracker.getNetMetrixTag({
        domain: 'aznetz',
        path: {
          product: 'live',
          sitename: skin,
          path: page_url,
          view: 'page-noscript',
          event: 'pageview'
        }
      });
    }


    var version = process.env.VERSION || '@@VERSION';
    var data = {
      'withAds': pageType !== '',
      'withBugMuncher': env.BUG_MUNCHER === 'true',
      'pageType': pageType,
      'skin': skin,
      'iconPath': getIconPath(skin),
      'staticBasePath': '/__node__/' + version + '/__static__',
      'kaltura_frontend_video_player_id': domain.kaltura_frontend_video_player_id || env.KALTURA_PLAYER_ID,
      'kaltura_frontend_adless_video_player_id': domain.kaltura_frontend_adless_video_player_id || env.KALTURA_PLAYER_NOADS_ID,
      'kaltura_mediathek_video_player_id': domain.kaltura_mediathek_video_player_id || 'null',
      'kaltura_mediathek_category_id': domain.kaltura_mediathek_category_id || 'null',
      'netMetrixNoScript': netMetrixNoScript,
      'without_wemf': without_wemf
    };
    res.send(renderNunchuck(component, data));
  }

  render();
};
