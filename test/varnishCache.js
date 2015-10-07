var requestMock = require('./util/requestMock');
var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var cache = require('../server/routing/cache');


describe('routing: "cache" middleware', function() {

  var req;
  var res;
  var next;

  beforeEach(function() {
    this.req = new requestMock.ReqMock();
    this.res = new requestMock.ResMock();
    this.next = sinon.spy();
  });

  it('returns a middleware implementation', function() {
    var mw = cache(3600);
    expect(mw).to.exist;
  });

  it('should call next', function() {
    cache(3600)(this.req, this.res, this.next);
    assert(this.next.calledOnce);
  });

  it('sets the "Varnish-Control" header', function() {
    cache(3600)(this.req, this.res, this.next);
    expect(this.res.headers).to.have.property('Varnish-Control', 3600);
    expect(this.res.headers).to.not.have.property('Varnish-Grace');
  });

  it('sets the "Varnish-Grace" header', function() {
    cache(3600, 600)(this.req, this.res, this.next);
    expect(this.res.headers).to.have.property('Varnish-Control', 3600);
    expect(this.res.headers).to.have.property('Varnish-Grace', 600);
  });

  it('can be called with cacheTime set to "undefined"', function() {
    cache(undefined)(this.req, this.res, this.next);
    expect(this.res.headers).to.not.have.property('Varnish-Control');
    expect(this.res.headers).to.not.have.property('Varnish-Grace');
  });

  it('can be called with graceTime set to "undefined"', function() {
    cache(3600, undefined)(this.req, this.res, this.next);
    expect(this.res.headers).to.have.property('Varnish-Control', 3600);
    expect(this.res.headers).to.not.have.property('Varnish-Grace');
  });
});
