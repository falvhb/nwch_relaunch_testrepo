var chai = require('chai');
var nock = require('nock');
var expect = chai.expect;

var http = require('http');

var app = require('../server/server');

describe('Domain Model', function() {

  var host = 'http://localhost:8811';
  var basePath = '/api/v1/content/domains';

  function mockDomainsApi(domainId) {
    return nock(host)
            .get(basePath + '/' + domainId)
            .reply(200, {
              data: {
                id: domainId
              }
            });
  }

  function mockDomainsApi404(domainId) {
      return nock(host)
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
        expect(err).to.not.exist;
        expect(domain.data.id).to.equal('nabaward');
        done();
      });
    });

    it('defaults to `aaz`', function(done) {
      // mock setups
      mockDomainsApi('aaz');
      var req = { get: function() { return undefined; }};
      // test case
      app.models.Domain.fromRequest(req, function(err, domain) {
        expect(err).to.not.exist;
        expect(domain.data.id).to.equal('aaz');
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
        expect(err).to.not.exist;
        expect(domain.errors).to.exist;
        expect(domain.errors[0].code).to.equal(404);
        done();
      });
    });

  });
});
