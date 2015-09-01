var assert = require('chai').assert;

var urlTools = require('../common/urltools');


describe('Build absolute URL with path starting without "/"', function() {
  req = {
    headers: {
      protocol: 'http',
      hostname: 'localhost'
    }
  };
  assert(urlTools.absoluteURL(req, 'test/path'),
         'http://localhost/test/path');
});

describe('Build absolute URL with path starting with "/"', function() {
  req = {
    headers: {
      protocol: 'https',
      hostname: 'localhost'
    }
  };
  assert(urlTools.absoluteURL(req, '/test/path'),
         'https://localhost/test/path');
});
