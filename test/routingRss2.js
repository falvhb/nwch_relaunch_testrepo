var rssRouter = require('../server/routing/routingRss2');

var requestMock = require('./util/requestMock');
var assert = require('chai').assert;
var fs = require('fs');
var xmljs = require('libxmljs');

var ReqMock = requestMock.ReqMock;
var ResMock = requestMock.ResMock;


function mockApiGet(request, sampleFeed) {
  request.api.get = function(key) {
    if (key === 'rss2') {
      sampleFeed.items = [
        {
          title: '1st news article',
          lead: 'Anriss 1',
          id: 122333,
          dc: {
            effective: '2009-02-25T05:08:22+01:00',
          },
          text: 'The actual text of 1st news article',
          assets: [
            {
              asset: {
                content_type: 'asset_image',
                image_url: 'http://ip-proxy.com/someImage.jpg',
              }
            }
          ],
          ressorts: [
            {
              parent: {
                ignore_for_canonical: false,
                urlpart: 'mainRessortPath',
                title: 'The MainRessort Title',
              },
              ignore_for_canonical: false,
              urlpart: 'subRessortPath',
              title: 'The SubRessort Title',
            }
          ]
        }
      ]
      sampleFeed.ressort = {
        parent: {
          ignore_for_canonical: false,
          urlpart: 'mainRessortPath',
          title: 'The MainRessort Title',
        },
        ignore_for_canonical: false,
        urlpart: 'subRessortPath',
        title: 'The SubRessort Title',
      }
      return {
        data: sampleFeed,
        total: 23
      };
    }
  }
}


describe('RSS2 Feed Router', function() {

  var req = null;
  var res = null;

  var sampleFeed = null;
  beforeEach(function() {
    req = new ReqMock();
    res = new ResMock();

    sampleFeed = {
      domain: {
        properties: {
          domain_name: 'www.domain.com',
          portal_title_seo: 'Aargauer Zeitung SEO Title',
          portal_description_seo: "The Portal's SEO description",
        }
      },
      items: [ ]
    }

  });

  it('behaves nicely with default values (no specific domain, ressort, items...)',
      function(done) {
    req.api.get = function(key) {
      if (key === 'rss2') {
        return {
          data: sampleFeed,
          total: 23
        };
      }
    }

    // process the request
    rssRouter(req, res);

    // parse the XML and check the basic structure
    var xml = xmljs.parseXml(res.body);

    assert.equal(xml.get('/rss').attr('version').value(), '2.0');

    assert.equal(xml.get('/rss/channel/title').text(), 'Aargauer Zeitung SEO Title');
    assert.equal(xml.get('/rss/channel/description').text(), 'The Portal\'s SEO description');
    assert.equal(xml.get('/rss/channel/link').text(), 'http://www.domain.com/');

    assert.equal(xml.get('/rss/channel/image/title').text(), 'Aargauer Zeitung SEO Title');
    assert.equal(xml.get('/rss/channel/image/link').text(), 'http://www.domain.com/');
    assert.equal(xml.get('/rss/channel/image/url').text(), 'http://www.domain.com/static/az/style/aaz/img/pageLogo.png');

    assert.equal(xml.get('/rss/channel/copyright').text(), 'Copyright (c): a-z.ch, AZ Crossmedia AG, Neumattstrasse 1, CH-5001 Aarau');
    assert.equal(xml.get('/rss/channel/language').text(), 'de-ch');

    assert.equal(xml.find('/rss/channel/item').length, 0);

    done();
  });

  it('should render items properly', function(done) {
    mockApiGet(req, sampleFeed);

    // process the request
    rssRouter(req, res);

    // parse the XML and check the basic structure
    var xml = xmljs.parseXml(res.body);

    assert.equal(xml.get('/rss/channel/title').text(), 'Aargauer Zeitung SEO Title');
    var items = xml.find('/rss/channel/item');
    assert.equal(items.length, 1);
    assert.equal(items[0].get('./title').text(), '1st news article');
    assert.equal(items[0].get('./description').text(), 'Anriss 1');
    assert.equal(items[0].get('./link').text(), 'http://www.domain.com/mainRessortPath/subRessortPath/1st-news-article-122333');
    assert.equal(items[0].get('./guid').text(), '122333');
    assert.equal(items[0].get('./guid').attr('isPermaLink').value(), 'false');

    done();
  });

  it("should respect 'ressort' properly", function(done) {
    mockApiGet(req, sampleFeed);

    req.params.ressort = 'mainRessortPath';

    // process the request
    rssRouter(req, res);

    // parse the XML and check the basic structure
    var xml = xmljs.parseXml(res.body);

    assert.equal(xml.get('/rss/channel/title').text(), 'Aargauer Zeitung SEO Title : The MainRessort Title');
    assert.equal(xml.get('/rss/channel/link').text(), 'http://www.domain.com/mainRessortPath');
    var items = xml.find('/rss/channel/item');
    assert.equal(items.length, 1);
    assert.equal(items[0].get('./title').text(), '1st news article');
    assert.equal(items[0].get('./description').text(), 'Anriss 1');
    assert.equal(items[0].get('./link').text(), 'http://www.domain.com/mainRessortPath/subRessortPath/1st-news-article-122333');
    assert.equal(items[0].get('./guid').text(), '122333');
    assert.equal(items[0].get('./guid').attr('isPermaLink').value(), 'false');

    done();
  });

  it("should respect 'ressort/subressort' properly", function(done) {
    mockApiGet(req, sampleFeed);

    req.params.ressort = 'mainRessortPath';
    req.params.subressort = 'subRessortPath';

    // process the request
    rssRouter(req, res);

    // parse the XML and check the basic structure
    var xml = xmljs.parseXml(res.body);

    assert.equal(xml.get('/rss/channel/title').text(), 'Aargauer Zeitung SEO Title : The SubRessort Title');
    assert.equal(xml.get('/rss/channel/link').text(), 'http://www.domain.com/mainRessortPath/subRessortPath');
    var items = xml.find('/rss/channel/item');
    assert.equal(items.length, 1);
    assert.equal(items[0].get('./title').text(), '1st news article');
    assert.equal(items[0].get('./description').text(), 'Anriss 1');
    assert.equal(items[0].get('./link').text(), 'http://www.domain.com/mainRessortPath/subRessortPath/1st-news-article-122333');
    assert.equal(items[0].get('./guid').text(), '122333');
    assert.equal(items[0].get('./guid').attr('isPermaLink').value(), 'false');

    done();
  });

  it("should get 'rss2full.xml' if requested", function(done) {
    mockApiGet(req, sampleFeed);

    req.originalUrl = 'http://www.domain.com/mainRessortPath/rss2full.xml';
    req.params.ressort = 'mainRessortPath';

    // process the request
    rssRouter(req, res);

    // parse the XML and check the basic structure
    var xml = xmljs.parseXml(res.body);

    assert.equal(xml.get('/rss/channel/title').text(), 'Aargauer Zeitung SEO Title : The MainRessort Title');
    assert.equal(xml.get('/rss/channel/link').text(), 'http://www.domain.com/mainRessortPath');
    var items = xml.find('/rss/channel/item');
    assert.equal(items.length, 1);
    assert.equal(items[0].get('./title').text(), '1st news article');
    assert.equal(items[0].get('./description').text(), 'Anriss 1');
    assert.equal(items[0].get('./link').text(), 'http://www.domain.com/mainRessortPath/subRessortPath/1st-news-article-122333');
    assert.equal(items[0].get('./guid').text(), '122333');
    assert.equal(items[0].get('./guid').attr('isPermaLink').value(), 'false');

    // 'content:encoded'
    var nodes = items[0].childNodes();
    assert.equal(nodes[nodes.length - 1].namespace().prefix(), 'content');
    assert.equal(nodes[nodes.length - 1].text(), 'The actual text of 1st news article');

    done();
  });
});
