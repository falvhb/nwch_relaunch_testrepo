var request = require('supertest');
var assert = require('assert');


describe('Express', function() {
  var testApp = null;
  var logger = null;

  before(function() {
    testApp = require('../server/server');
    logger = {
      _error: '',
      error: function(message) {
        this._error += message;
      }
    };
    testApp.set('logger', logger);
  });

  beforeEach(function() {
    logger._error = '';
  });

  it('is not null', function() {
    assert.notEqual(testApp, null);
    assert.equal(typeof testApp, 'function');
    assert.equal(typeof testApp.use, 'function');
    assert.equal(typeof testApp.param, 'function');
  });

  it('listens on /', function(done) {
    request(testApp)
      .get('/')
      .expect(200, done);
  });

  it('returns 200 OK but logs an error if the route is not known', function(done) {
    request(testApp)
      .get('/non-existent-route')
      .expect(200)
      .end(function(err, res) {
        assert.notEqual(logger._error, '');
        done();
      });
  });
});
