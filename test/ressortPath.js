var requestMock = require('./util/requestMock');
var ressortPath = require('../server/modules/ressortPath');
var assert = require('chai').assert;


var ReqMock = requestMock.ReqMock;
var ResMock = requestMock.ResMock;

describe('modules: "ressortPath" util', function() {

  var req = null;
  var res = null;

  beforeEach(function() {
    req = new ReqMock();
    res = new ResMock();
  });

  it("behaves nicely if no expected 'params' are set", function() {
    assert.strictEqual(ressortPath(req), null);
  });

  it("returns the string value of 'params.ressort' if set", function() {
    req.params.ressort = 'mainRessort';
    assert.strictEqual(ressortPath(req), 'mainRessort');
  });

  it("returns the concatenated ressort/subressort string value ressort and subressort are set", function() {
    req.params.ressort = 'mainRessort';
    req.params.subressort = 'subRessort';
    assert.strictEqual(ressortPath(req), 'mainRessort/subRessort');
  });
});
