var sinon = require('sinon');
var assert = require('chai').assert;

var nodeIncludesRouter = require('../server/routing/routingNodeIncludes.js');


describe('Node Includes', function() {

  // setup the test data and spies.
  var sendFuncSpy = null;
  var response = null;

  // test cases and their requests
  var req = {};
  require('../server/routing/api.js')(req, {}, function() {});
  req.api._data.domain = {};
  var testRequests = [
    { name: 'Body Bottom',
      request: {
        params: {viewname: '__body_bottom'},
        api: req.api
      }
    },
    { name: 'Head Bottom',
      request: {
        params: {viewname: '__head_bottom'},
        api: req.api
      }
    },
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
