/* eslint-disable no-param-reassign */
var axios = require('axios');

var api = process.env.API_BASE_URL || 'http://localhost:8811/api/v1';


/**
 * The API connector.
 */
function Api() {
  this._count = 0;
  this._data = {};
  this._doneCallbacks = [];
}


Api.prototype._startApiCall = function() {
  ++this._count;
};


Api.prototype._endApiCall = function() {
  --this._count;
  if (this._count === 0) {
    this._invokeDone();
  }
};


Api.prototype._invokeDone = function() {
  this._doneCallbacks.forEach(function(cb) {
    cb();
  });
};


/**
 * Perform an API call.
 *
 * apiConfig - object
 *    endpoint: the api endpoint to call
 *    key: under which key the retrieved data should be stored
 * cb - callback (optional)
 */
Api.prototype.retrieve = function(apiConfig, cb) {
  var self = this;

  if (typeof apiConfig.key !== 'string') {
    throw new Error('key not set');
  }
  this._data[apiConfig.key] = null;

  if (typeof cb !== 'function') {
    cb = function () {/**/};
  }

  this._startApiCall();

  // make the request
  axios.get(api + apiConfig.endpoint)
    .then(function(response) {
      // success - store the retrieved object
      self._data[apiConfig.key] = response.data;
      cb(null, response.data);
      self._endApiCall();
    })
    .catch(function(response) {
      if (response.data) {
        self._data[apiConfig.key] = response.data;
      }
      if (response instanceof Error) {
        cb(response);
      } else {
        cb(new Error(response.status));
      }
      self._endApiCall();
    });
};


/**
 * Register a callback to be called when all API calls are done.
 */
Api.prototype.done = function(callback) {
  if (typeof callback !== 'function') {
    throw new Error('`callback` is not a function.');
  }

  this._doneCallbacks.push(callback);

  // if there are no pending api calls -> invoke callback
  if (this._count === 0) {
    this._invokeDone();
  }
};


/**
 * Get a retrieved value.
 */
Api.prototype.get = function(key) {
  return this._data[key];
};


/**
 * Register the API middleware.
 */
module.exports = function(req, res, next) {
  req.api = new Api();
  next();
};

module.exports.waitAPI = function(req, res, next) {
  req.api.done(function() {
    next();
  });
};
