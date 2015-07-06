var fs = require('fs');
var http = require('http');
var path = require('path');
var assert = require('assert');

describe('Body Bottom Include', function() {
  it('contains the file content of __body_bottom.html', function(done) {
    var options = {
      host: 'localhost',
      port: '8000',
      path: '/ressort/subressort/placeholder/__body_bottom'
    };
    http.request(options, function(response) {
      var str = '';
      response.on('data', function(chunk) {
        str += chunk;
      });
      response.on('end', function() {
        assert.equal(str, fs.readFileSync(path.join(__dirname, '../', 'app', 'node_modules', 'components', 'includes', '__body_bottom.html')));
        done();
      });
    }).end();
  });
});

describe('Head Bottom Include', function() {
  it('contains the script that loads az-fonts', function(done) {
    var options = {
      host: 'localhost',
      port: '8000',
      path: '/ressort/subressort/placeholder/__head_bottom'
    };
    http.request(options, function(response) {
      var str = '';
      response.on('data', function(chunk) {
        str += chunk;
      });
      response.on('end', function() {
        assert.ok(str.indexOf('az-fonts') >= 0);
        done();
      });
    }).end();
  });
});

