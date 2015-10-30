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
  this.set(apiConfig.key, null);

  if (typeof cb !== 'function') {
    cb = function () {/**/};
  }

  this._startApiCall();

  // make the request
  axios.get(api + apiConfig.endpoint)
    .then(function(response) {
      // success - store the retrieved object
      self.set(apiConfig.key, response.data);
      cb(null, response.data);
      self._endApiCall();
    })
    .catch(function(response) {
      if (response.data) {
        self.set(apiConfig.key, response.data);
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
 * Can be used to tell the Api that there is an external Api call running.
 * After calling this method "endExternalApiCall" must be used when the
 * external call has been finished. If "endExternalApiCall" is not call the
 * Api will block forever in the done method.
 */
Api.prototype.startExternalApiCall = function(key) {
  if (key) {
    this._data[key] = null;
  }
  this._startApiCall();
};


/**
 * Tell the Api that a started request is finished.
 */
Api.prototype.endExternalApiCall = function(key, value) {
  if (key) {
    this._data[key] = value;
  }
  this._endApiCall();
};


/**
 * Get a retrieved value.
 */
Api.prototype.get = function(key) {
  return this._data[key];
};


/**
 * Set a retrieved value.
 */
Api.prototype.set = function(key, value) {
  this._data[key] = value;
};


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
  var dcb = this._doneCallbacks;
  this._doneCallbacks = [];
  dcb.forEach(function(cb) {
    cb();
  });
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
