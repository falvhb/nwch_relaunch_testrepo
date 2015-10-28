var cloadClub = require('../api/cloadClub');

/**
 * A middleware to load the the club data.
 *
 * req.params.club_urlpart: the urlpart of the club in the form <text>-<id>
 *                          only the <id> part is used to lookup the club
 */
module.exports = function(req, res, next) {
  cloadClub(req, res);

  // signal that we need to wait for the API to finish the request
  next();
};
