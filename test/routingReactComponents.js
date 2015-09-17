var componentsRouter = require('../server/routing/routingReactComponents');
var assert = require('assert');


describe('Components Router', function() {
  function ResMock() {
    this.body = '';
    this.write = function(chunk) {
      this.body += chunk;
    };
    this.send = function(content) {
      this.write(content);
      this.end();
    };
    this.end = function() {
      // dummy
    };
  }

  function ReqMock() {
    this.api = {
      retrieve: function() {},
      done: function(cb) { cb(); },
      get: function() {}
    };
    this._parsedUrl = {
      path: ''
    };
    this.headers = {
      'x-skin': 'aaz'
    };
  }

  var res = null;
  var req = null;
  var sampleArticle = null;
  beforeEach(function () {
    res = new ResMock();
    req = new ReqMock();
    sampleArticle = {
      context_label: 'catchword',
      title: 'title',
      source: { title: 'the title'},
      dc: {
        publisher: 'ls.sample',
        creator_name: '',
        effective: '2009-02-25T05:10:19+01:00',
        creator: 'ls.sample',
        creator_email: '',
        expires: null,
        modified: '2009-02-25T05:10:19+01:00',
        created: '2009-02-25T05:10:19+01:00',
        contributor: 'ls.sample'
      },
      author: 'the author',
      published: '',
      modified: '',
      publicationDate: ''
    };
  });

  it('can handle missing `article` property', function() {
    componentsRouter(req, res);
    assert.ok(res.body.indexOf('<!-- No component name provided! -->') === 0);
  });

  it('can handle missing `params` property', function() {
    componentsRouter(req, res);
    assert.ok(res.body.indexOf('<!-- No component name provided! -->') === 0);
  });

  it('returns an HTML comment including errors if no data is found', function() {
    req.api.get = function(key) {
      if (key === 'article') {
        return {
          errors: [
            { detail: 'err_detail' }
          ]
        };
      }
    };
    req.params = {
      articleId: 100003399,
      component: 'teaser',
      variation: 'dontknow'
    };

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('err_detail') >= 0);
  });

  it('returns an HTML comment if the component is not found', function() {
    req.params = {
      articleId: 100003399,
      component: 'non-existent-component',
      variation: 'dontknow'
    };
    req.api.get = function(key) {
      if (key === 'article') {
        return {
          data: sampleArticle
        };
      }
    };

    componentsRouter(req, res);
    assert.ok(res.body.indexOf('<!-- Component "non-existent-component" not found! -->') >= 0);
  });

  it('returns a part of the page', function() {
    req.api.get = function(key) {
      if (key === 'article') {
        return {
          data: sampleArticle
        };
      }
    };
    req.params = {
      articleId: 100003399,
      component: 'article-header',
      variation: 'dontknow'
    };

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('<header class="article-header"') >= 0);
  });
});
