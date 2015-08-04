/**
 * Loads the logged in user (based on `id` in the session cookie) and stores it
 * in `req.user`. If `id` is not set or the user can not be fetched, `req.user`
 * is `null`.
 */
function loadUser(req, res, next) {
  req.user = null;
  if (req.session.id) {
    var id = req.session.id;
    req.app.models.AZUser.get(id, function(err, user) {
      if (err) {
        next(err);
      } else if (user && user.data) {
        req.user = user.data;
        next();
      } else {
        next('User "' + id + '" not found!');
      }
    });
  } else {
    next('Session .id not set.');
  }
}


module.exports = loadUser;
