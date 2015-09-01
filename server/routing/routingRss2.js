/* eslint-disable no-warning-comments */

var wrappedRenderer = require('./wrappedRenderer');
var RSS = require('rss');
var staticDomainCSSPath = require('../modules/cdn');
var ressortPath = require('../modules/ressortPath');
var formCanonicalUrlPath = require('../../app/node_modules/helpers/get-article-url').formCanonicalUrlPath;
var getMainAsset = require('../../app/node_modules/helpers/get-main-asset');

var LOGO_PNG_PATH = '/img/pageLogo.png';
var COPYRIGHT = "Copyright (c): a-z.ch, AZ Crossmedia AG, " +
                "Neumattstrasse 1, CH-5001 Aarau";
var FEED_LANGUAGE = 'de-ch';


function checkData(apiData) {
  if (!apiData || apiData && !apiData.data) {
    throw Error('Could not retrieve all data for the requested RSS2 feed');
  }
  return apiData.data;
}

function feedTitle(domainInfo, ressortInfo, rsPath) {
  var fTitle = domainInfo.properties.portal_title_seo || '';
  if (fTitle && ressortInfo && rsPath) {
    var ressortTitle;
    if (rsPath.split('/').length === 1) {
      // main ressort
      ressortTitle = ressortInfo.parent && ressortInfo.parent.title || '';
    } else {
      // sub ressort
      ressortTitle = ressortInfo.title;
    }
    fTitle += ' : ' + ressortTitle;
  }
  return fTitle;
}

function domainUrl(domainInfo) {
  var url = domainInfo.properties.domain_name || '';
  if (!url.startsWith('http')) {
    url = 'http://' + url;
  }
  if (!url.endsWith('/')) {
    url += '/';
  }
  return url;
}

function isFullRss(req) {
  return (
    req.originalUrl && req.originalUrl.endsWith('rss2full.xml')
  ) ? true
    : false;
}

module.exports = function routingRss2(req, res) {

  function render() {
    var isFull = isFullRss(req);
    var domainName = req.headers['x-skin'] || 'aaz';
    var rssData = checkData(req.api.get('rss2'));
    var domainInfo = rssData.domain;
    var ressortInfo = null;
    var items = rssData.items;

    var domain = domainUrl(domainInfo);
    var siteUrl = domain;
    var rsPath = ressortPath(req);
    if (rsPath) {
      siteUrl += rsPath;
      // If a ressort filter is requested, the title changes accoringly. Hence,
      // we need the (sub)ressort.
      // If no ressort filter is requested, the portal info can be used.
      ressortInfo = rssData.ressort;
    }
    var feedUrl = siteUrl;
    if (!feedUrl.endsWith('/')) {
      feedUrl += '/';
    }
    feedUrl += (isFull) ? 'rss2full.xml' : 'rss2.xml';

    var feedData = {
      title: feedTitle(domainInfo, ressortInfo, rsPath),
      site_url: siteUrl,
      feed_url: feedUrl,
      description: domainInfo.properties.portal_description_seo || '',
      language: FEED_LANGUAGE,
      image_url: staticDomainCSSPath(domain, domainName) + LOGO_PNG_PATH,
      copyright: COPYRIGHT,
      custom_namespaces: {
        'media': 'http://search.yahoo.com/mrss/'
      },
    };
    var feed = new RSS(feedData);

    items.forEach(function(item) {
      var customFields = [];
      // calculate the canonical URL
      var itemUrl = null;
      var cUrl = formCanonicalUrlPath(item);
      if (cUrl) {
        itemUrl = domain + cUrl;
      }
      // calculate the asset image URL
      var mainAsset = getMainAsset(item.assets);
      if (mainAsset && mainAsset.image_url) {
        customFields.push({
          'media:content': {
            _attr: {
              medium: 'image',
              isDefault: true,
              url: mainAsset.image_url,
              type: 'image/jpg',
            }
          }
        });
      }
      if (isFull) {
        customFields.push({
          'content:encoded': {
            _cdata: item.text || ''
          }
        });
        // TODO: different image url (variation) for full rss.
      }
      feed.item({
        title: item.title || '',
        description: item.lead || '',
        url: itemUrl,
        guid: item.id,
        date: item.dc.effective || '',
        custom_elements: customFields,
      });
    });

    res.set('Content-Type', 'text/xml');
    res.send(feed.xml());
  }

  req.api.done(wrappedRenderer(res, render));
};
