function ResMock() {
  this.body = '';
  this.headers = {};
  this.write = function(chunk) {
    this.body += chunk;
  };
  this.send = function(content) {
    this.write(content);
    this.end();
  };
  this.end = function() {
    // dummy
  };
  this.set = function(key, value) {
    this.headers[key] = value;
  }
}

function ReqMock() {
  this.api = {
    retrieve: function() {},
    done: function(cb) { cb(); },
    get: function() {}
  };
  this.params = {};
  this._parsedUrl = {
    path: ''
  };
  this.headers = {
    'x-skin': 'aaz'
  };
}


module.exports = {
  ReqMock: ReqMock,
  ResMock: ResMock,
}
