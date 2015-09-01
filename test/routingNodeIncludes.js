var requestMock = require('./util/requestMock');
var sinon = require('sinon');
var assert = require('chai').assert;

var nodeIncludesRouter = require('../server/routing/routingNodeIncludes.js');


var ReqMock = requestMock.ReqMock;
var ResMock = requestMock.ResMock;

function testRequest(viewname) {
  var reqMock = new ReqMock();
  reqMock.params.viewname = viewname;
  reqMock.api.get = function(key) {
    if (key === 'domain') {
      return {
        kaltura_frontend_video_player_id: '1234',
        kaltura_frontend_adless_video_player_id: '5678',
        kaltura_mediathek_video_player_id: '8765',
        kaltura_mediathek_category_id: '4321',
      }
    }
  }
  return reqMock;
}

describe('Node Includes', function() {

  // setup the test data and spies.
  var sendFuncSpy = null;
  var response = null;

  // test cases and their requests
  var testRequests = [
    { name: 'Body Bottom', request: testRequest('__body_bottom')},
    { name: 'Head Bottom', request: testRequest('__head_bottom')},
  ];

  testRequests.forEach(function(testCase) {
    before(function() {
      // init spies
      sendFuncSpy = sinon.spy();
      response = {send: sendFuncSpy};

      // call the router with test data and spies.
      nodeIncludesRouter(testCase.request, response);
    });

    it('should return the ' + testCase.name + ' component, rendered as html.', function(done) {
      var renderedComponent = sendFuncSpy.args[0][0]; // 1st argument of 1st call
      assert.notInclude(renderedComponent, '{%', 'does not include `{%`');
      assert.notInclude(renderedComponent, '%}', 'does not include `%}`');
      done();
    });
  });

});
