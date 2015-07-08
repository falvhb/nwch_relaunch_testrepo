var sinon = require('sinon');
var assert = require('chai').assert;
var dummyApp = require('loopback')();

var paramsRouter = require('../server/routing/routingParams.js');


describe('Routing Params', function() {

  var paramFuncSpy = sinon.spy();

  before(function() {
    dummyApp.param = paramFuncSpy;
    paramsRouter(dummyApp);
  });

  it('should register `articleId` on `app.param`', function() {
    assert.isTrue(dummyApp.param.called);
    var firstCallArgs = dummyApp.param.args[0];
    assert.equal(firstCallArgs[0], 'articleId', '1st argument should be `articleId`');
    assert.isFunction(firstCallArgs[1], 'articleId', '2nd argument should be a function');
  });

  it('should', function() {
    console.log(paramFuncSpy);
  });

});

