var sinon = require('sinon');
var assert = require('chai').assert;

var nodeIncludesRouter = require('../server/routing/routingNodeIncludes.js');


describe('Node Includes', function() {

  // setup the test data and spies.
  var writeFuncSpy = null;
  var endFuncSpy = null;
  var response = null;

  // test cases and their requests
  var testRequests = [
    { name: 'Body Bottom', request: {params: {viewname: '__body_bottom'}}},
    { name: 'Head Bottom', request: {params: {viewname: '__head_bottom'}}},
  ]

  testRequests.forEach(function(testCase) {
    before(function() {
      // init spies
      writeFuncSpy = sinon.spy();
      endFuncSpy = sinon.spy();
      response = {write: writeFuncSpy,
                  end: endFuncSpy};

      // call the router with test data and spies.
      nodeIncludesRouter(testCase.request, response);
    });

    it('should return the ' + testCase.name + ' component, rendered as html.', function(done) {
      var renderedComponent = writeFuncSpy.args[0][0]; // 1st argument of 1st call
      assert.notInclude(renderedComponent, '{%', 'does not include `{%`');
      assert.notInclude(renderedComponent, '%}', 'does not include `%}`');
      done();
    });

    it('`end()` should be called on the response', function(done) {
      assert.isTrue(response.end.calledOnce);
      assert.isTrue(response.end.calledAfter(writeFuncSpy));
      done();
    });
  });

});
