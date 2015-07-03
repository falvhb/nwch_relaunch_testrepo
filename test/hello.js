var chai = require('chai');
var expect = chai.expect;

var app = require('../server/server');

describe('Domain Model', function() {
  describe('fromRequest', function() {
    it('considers request header `X_ZOPE_SKIN`', function(done) {
      var req = { get: function(str) { return str === 'X_ZOPE_SKIN' ? 'nabaward' : undefined; }};
      app.models.Domain.fromRequest(req, function(err, domain) {
        expect(err).to.not.exist;
        expect(domain.data.id).to.equal('nabaward');
        done();
      });
    });
    
    it('defaults to `aaz`', function(done) {
      var req = { get: function() { return undefined; }};
      app.models.Domain.fromRequest(req, function(err, domain) {
        expect(err).to.not.exist;
        expect(domain.data.id).to.equal('aaz');
        done();
      });
    });
    
    it('returns an error', function(done) {
      var req = { get: function(str) { return str === 'X_ZOPE_SKIN' ? 'doesnotexist' : undefined; }};
      app.models.Domain.fromRequest(req, function(err, domain) {
        expect(err).to.not.exist;
        expect(domain.errors).to.exist;
        expect(domain.errors[0].code).to.equal(404);
        done();
      });
    });
    
    it('is just a test', function(done) {
      expect(0).to.satisfy(function(num) { return num < 10; });
      done();
    });
    
    it('should succeed', function(done) {
      expect(3).to.satisfy(function(num) { return num < 10; });
      done();
    });
  });
});
