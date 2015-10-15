/* eslint-disable no-warning-comments */
var _ = require('lodash');
var RSS = require('rss');
var staticDomainCSSPath = require('../modules/cdn');
var ressortPath = require('../modules/ressortPath');
var formCanonicalUrlPath = require('../../app/node_modules/helpers/article/get-url').formCanonicalUrlPath;
var getMainAsset = require('../../app/node_modules/helpers/asset/get-main-asset');
var image = require('../../common/image');
var urlTools = require('../../common/urltools');
var getSkinName = require('../modules/skin');

var LOGO_PNG_PATH = '/img/pageLogo.png';
var COPYRIGHT = "Copyright (c): a-z.ch, AZ Crossmedia AG, " +
                "Neumattstrasse 1, CH-5001 Aarau";
var FEED_LANGUAGE = 'de-ch';


module.exports = function routingRss2(req, res) {

  function ServiceUnavailable() {}
  ServiceUnavailable.prototype = new Error();

  function NotFound() {}
  NotFound.prototype = new Error();

  function checkData(apiData) {
    if (!apiData) {
      throw new ServiceUnavailable();
    }
    if (apiData.errors || !apiData.data) {
      throw new NotFound();
    }
    if (ressortPath(req) !== null && _.isEmpty(apiData.data.ressort)) {
      throw new NotFound();
    }
    if (_.isEmpty(apiData.data.domain)) {
      throw new NotFound();
    }
    return apiData.data;
  }

  function feedTitle() {
    var fTitle = domainInfo.properties.portal_title_seo || '';
    if (fTitle && ressortInfo && rsPath) {
      var ressortTitle = ressortInfo.title || '';
      if (ressortTitle) {
        fTitle += ' : ' + ressortTitle;
      }
    }
    return fTitle;
  }

  var isFull = req.originalUrl.endsWith('rss2full.xml') ? true : false;
  var domainName = getSkinName(req);
  var rssData = null;
  try {
    rssData = checkData(req.api.get('rss2'));
  } catch (e) {
    if (e instanceof ServiceUnavailable) {
      return res.status(503).send('Service Unavailable');
    }
    if (e instanceof NotFound) {
      return res.status(404).send('Not Found');
    }
    return res.status(500).send('Internal Server Error');
  }
  var domainInfo = rssData.domain;
  var ressortInfo = null;
  var items = rssData.items;

  var domain = urlTools.absoluteURL(req, '/');
  var siteUrl = domain;
  var rsPath = ressortPath(req);
  if (rsPath) {
    siteUrl += rsPath;
    // If a ressort filter is requested, the title changes accordingly. Hence,
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
    title: feedTitle(),
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
      var width, height;
      if (isFull) {
        width = 1400;
        height = 1400;
      } else {
        width = 600;
        height = 600;
      }
      customFields.push({
        'media:content': {
          _attr: {
            medium: 'image',
            isDefault: true,
            url: image.createImageSrc(mainAsset.image_url,
                                      width,
                                      height,
                                      false),
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
};
