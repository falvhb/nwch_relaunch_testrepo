var requestMock = require('./util/requestMock');
var ressortPath = require('../server/modules/ressortPath');
var assert = require('chai').assert;


describe('modules: "ressortPath" util', function() {

  var req = null;

  beforeEach(function() {
    this.req = new requestMock.ReqMock();
  });

  it("behaves nicely if no expected 'params' are set", function() {
    assert.strictEqual(ressortPath(this.req), null);
  });

  it("returns the string value of 'params.ressort' if set", function() {
    this.req.params.ressort = 'mainRessort';
    assert.strictEqual(ressortPath(this.req), 'mainRessort');
  });

  it("returns the concatenated ressort/subressort string value ressort and subressort are set", function() {
    this.req.params.ressort = 'mainRessort';
    this.req.params.subressort = 'subRessort';
    assert.strictEqual(ressortPath(this.req), 'mainRessort/subRessort');
  });
});
