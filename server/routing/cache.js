
/**Set varnish cache headers
 *
 * A middleware which set the response cache headers for varnish.
 *
 * cacheTime: set "Varnish-Control" in seconds
 * graceTime: set "Varnish-Grace" in seconds
 *
 * usage:
 *    cache(3600) : cache for an hour
 *    cache(3600, 600) : cache for an hour with a grace time of 10 minutes
 */
function cache(cacheTime, graceTime) {
  function cacheMiddleware(req, res, next) {
    if (cacheTime) {
      res.header('Varnish-Control', cacheTime);
      if (graceTime) {
        res.header('Varnish-Grace', graceTime);
      }
    }
    next();
  }
  return cacheMiddleware;
}

module.exports = cache;
