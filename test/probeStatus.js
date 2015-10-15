var requestMock = require('./util/requestMock');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var probestatus = require('../server/routing/probestatus');

describe('probestatus', function() {

  var req;
  var res;

  beforeEach(function() {
    this.req = new requestMock.ReqMock();
    this.res = new requestMock.ResMock();
  });

  it('performing a GET request to /probestatus (state: recommissioned initially)', function() {
    this.req.method = 'GET';
    probestatus(this.req, this.res);
    expect(this.res.headers).to.have.property('Content-Type', 'text/plain; charset=UTF-8');
    expect(this.res.body).equal('OK');
  });

  it('performing a POST request with param body="OFF" to initiate decommision', function() {
    this.req.method = 'POST';
    this.req.body = {body: 'OFF'};
    probestatus(this.req, this.res);
    expect(this.res.headers).to.have.property('Content-Type', 'text/plain; charset=UTF-8');
    expect(this.res.body).equal('OFF');
  });

  it('performing a GET request to /probestatus (state: decommissioned)', function() {
    this.req.method = 'GET';
    probestatus(this.req, this.res);
    expect(this.res.headers).to.have.property('Content-Type', 'text/plain; charset=UTF-8');
    expect(this.res.body).equal('OFF');
    expect(this.res.code).equal(503);
  });

  it('performing a POST request to /probestatus with param body="OK" to recommission', function() {
    this.req.method = 'POST';
    this.req.body = {body: 'OK'};
    probestatus(this.req, this.res);
    expect(this.res.headers).to.have.property('Content-Type', 'text/plain; charset=UTF-8');
    expect(this.res.body).equal('OK');
  });

  it('performing a GET request to /probestatus (state: recommissioned again)', function() {
    this.req.method = 'GET';
    probestatus(this.req, this.res);
    expect(this.res.headers).to.have.property('Content-Type', 'text/plain; charset=UTF-8');
    expect(this.res.body).equal('OK');
  });

});
  
