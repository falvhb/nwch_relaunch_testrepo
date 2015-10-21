module.exports = {

  absoluteURL: function(req, path) {
    /**
     * Creates an absolute URL for a relative path based on the request.
     *
     * req must be a express request object.
     */
    if (path && !path.startsWith('/')) {
      path = '/' + path;
    }
    return req.headers['x-forwarded-proto'] + '://' + req.headers.host + path;
  }

};
