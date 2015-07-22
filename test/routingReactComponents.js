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
    }
    this.end = function() {
      // dummy
    }
  };

  it('can handle missing `item` property', function() {
    var req = {};
    var res = new ResMock();

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('<!-- Article "undefined" not found! -->') === 0);
  });

  it('can handle missing `params` property', function() {
    var req = {
      item: {
        data: {}
      }
    };
    var res = new ResMock();

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('<!-- Component "undefined" not found! -->') === 0);
  });

  it('returns an HTML comment if no data is found', function() {
    var req = {
      item: {},
      params: {
        articleId: 100003399
      }
    };

    var res = new ResMock();

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('<!-- Article "100003399" not found! -->') >= 0);
  });

  it('returns an HTML comment including errors if not data is found', function() {
    var req = {
      item: {
        errors: [
          { detail: 'err_detail' }
        ]
      },
      params: {
        articleId: 100003399
      }
    };

    var res = new ResMock();

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('err_detail') >= 0);
  });

  it('returns an HTML comment if the component is not found', function() {
    var res = new ResMock();
    var req = {
      item: {
        data: {

        }
      },
      params: {
        articleId: 100003399,
        component: 'non-existent-component',
        variation: 'dontknow'
      }
    };

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('<!-- Component "non-existent-component" not found! -->') >= 0);
  });

  it('returns a part of the page', function() {
    var res = new ResMock();
    var req = {
      item: {
        data: {
          catchword: 'catchword',
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
        }
      },
      params: {
        articleId: 100003399,
        component: 'article-header',
        variation: 'dontknow'
      }
    };

    componentsRouter(req, res);

    assert.ok(res.body.indexOf('<div class="az-iso') >= 0);
  });
});
