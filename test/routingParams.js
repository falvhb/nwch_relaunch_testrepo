var sinon = require('sinon');
var assert = require('chai').assert;
var loopback = require('loopback');
var request = require('supertest');

var paramsRouter = require('../server/routing/routingParams.js');


describe('Routing Params', function() {

  describe('register param `:articleId`', function() {
    var testApp = null;
    var paramFuncSpy = sinon.spy();

    before(function() {
      testApp = loopback();
      testApp.param = paramFuncSpy;
      paramsRouter(testApp);
    });

    it('should register `articleId` on `app.param`', function() {
      assert.isTrue(testApp.param.called);
      var firstCallArgs = testApp.param.args[0];
      assert.equal(firstCallArgs[0], 'articleId', '1st argument should be `articleId`');
      assert.isFunction(firstCallArgs[1], 'articleId', '2nd argument should be a function');
    });
  });


  describe('resolve an articleId', function() {
    var testApp = null;
    var articleStub = null;

    function installStub(testApp, stubFunc) {
      // mock the PublishedNewsArticle's 'get' method
      var model = require('../server/server.js').models.PublishedNewsArticle;
      var stub = sinon.stub(model, 'get', stubFunc);

      // install the stub
      testApp.models = { PublishedNewsArticle: { get: stub }};
      return stub;
    }

    describe('normal case where an article can be resolved', function() {
      function normalCaseStub(id, callback) {
        callback(null /*err*/, {foundArticle: id});
      }
      before(function() {
        testApp = loopback();
        articleStub = installStub(testApp, normalCaseStub);
        // install the params router
        paramsRouter(testApp);
      });
      after(function() {
        articleStub.restore();
      });

      it('should place the article on the request', function(done) {
        // define a test route with the 'articleId' param
        testApp.use('/foo/:articleId', function router(req, res) {

          assert.ok(req.item, 'placed requested article on `request.item`');
          assert.equal(req.item.foundArticle, '123', 'requested article is as expected');

          res.json({calledTestRoute: true});
          res.end();
        });

        request(testApp)
          .get('/foo/123')
          .expect(200)
          .end(function(err, res) {
            assert.isTrue(res.body.calledTestRoute, 'called test route');
            done();
          });
      });
    });

    describe('edge case where an article can\'t be resolved', function() {
      function edgeCaseNotFoundStub(id, callback) {
        callback(null /*err*/, null);
      }
      before(function() {
        testApp = loopback();
        articleStub = installStub(testApp, edgeCaseNotFoundStub);
        // install the params router
        paramsRouter(testApp);
      });
      after(function() {
        articleStub.restore();
      });

      it('should say `Article not found`', function(done) {
        testApp.use('/foo/:articleId', function unallowedFunction(req, res) {
          // in this case, the implementation of 'routingParams' will not call
          // this function `unallowedFunction`.
          // Hence, the code below must never be executed!
          assert.isTrue(false); // ensure that the test will fail if this will be exectued.
          res.end();
        });

        request(testApp)
          .get('/foo/123')
          .expect(500)  // no other route in the app will handle the error, hence the 500
          .end(function(err, res) {
            if (err) { return done(err); } // return if i.e. status code is not 500
            assert.ok(res.error, 'error is passed on');
            assert.equal(res.error.text, "Article &quot;123&quot; not found!\n");
            done();
          });
      });
    });

    describe('edge case where an error happens', function() {
      function edgeCaseErrorHappendedStub(id, callback) {
          callback(true);
      }
      before(function() {
        testApp = loopback();
        installStub(testApp, edgeCaseErrorHappendedStub);
        // install the params router
        paramsRouter(testApp);
      });
      after(function() {
        articleStub.restore();
      });

      it('should return with an error', function(done) {
        testApp.use('/foo/:articleId', function unallowedFunction(req, res) {
          // in this case, the implementation of 'routingParams' will not call
          // this function `unallowedFunction`.
          // Hence, the code below must never be executed!
          assert.isTrue(false); // ensure that the test will fail if this will be exectued.
          res.end();
        });

        request(testApp)
          .get('/foo/123')
          .expect(500)  // no other route in the app will handle the error, hence the 500
          .end(function(err, res) {
            if (err) { return done(err); } // return if i.e. status code is not 500
            assert.ok(res.error, 'error is passed on');
            assert.equal(res.error.text, 'true\n');
            done();
          });
      });
    });
  });

});

