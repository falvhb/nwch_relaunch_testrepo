var assert = require('assert');
var nock = require('nock');

var http = require('http');

var app = require('../server/server');

describe('Domain Model', function() {

  var host = 'http://localhost:8811';
  var basePath = '/api/v1/content/domains';

  function mockDomainsApi(domainId) {
    return nock(host, { allowUnmocked: true })
            .get(basePath + '/' + domainId)
            .reply(200, {
              data: {
                id: domainId
              }
            });
  }

  function mockDomainsApi404(domainId) {
      return nock(host, { allowUnmocked: true })
            .get(basePath + '/' + domainId)
            .reply(404, {
              errors: [
                {
                  code: 404
                  // note: the actual API returns more than just the 'code'.
                  // extend if necessary
                }
              ]
            });
  }

  describe('fromRequest', function() {

    it('considers request header `X_ZOPE_SKIN`', function(done) {
      // mock setups
      var domainId = 'nabaward'
      mockDomainsApi(domainId);
      var req = { get: function(str) { return str === 'X_ZOPE_SKIN' ? domainId : undefined; }};
      // test case
      app.models.Domain.fromRequest(req, function(err, domain) {
        assert.ok(typeof err === 'undefined' || err === null);
        assert.strictEqual(domain.data.id, 'nabaward');
        done();
      });
    });

    it('defaults to `aaz`', function(done) {
      // mock setups
      mockDomainsApi('aaz');
      var req = { get: function() { return undefined; }};
      // test case
      app.models.Domain.fromRequest(req, function(err, domain) {
        assert.ok(typeof err === 'undefined' || err === null);
        assert.strictEqual(domain.data.id, 'aaz');
        done();
      });
    });

    it('considers the cached domainConfig', function(done) {
      var domainId = 'nabaward';
      mockDomainsApi(domainId);
      var req = {
        get: function(str) { return str === 'X_ZOPE_SKIN' ? domainId : undefined; },
        domainConfig: {
          data: {
            id: domainId
          }
        }
      };
      app.models.Domain.fromRequest(req, function(err, domain) {
        var dummy = req.domainConfig;
        assert.ok(typeof err === 'undefined' || err === null);
        assert.strictEqual(domain.data.id, 'nabaward');
        assert.ok(domain === dummy);
        done();
      });
    });

    it('returns an error', function(done) {
      // mock setups
      var domainId = 'doesnotexist';
      mockDomainsApi404(domainId);
      var req = { get: function(str) { return str === 'X_ZOPE_SKIN' ? domainId : undefined; }};
      // test case
      app.models.Domain.fromRequest(req, function(err, domain) {
        assert.ok(typeof err === 'undefined' || err === null);
        assert.ok(typeof domain.errors !== 'undefined' && domain.errors !== null);
        assert.strictEqual(domain.errors[0].code, 404);
        done();
      });
    });

  });
});
