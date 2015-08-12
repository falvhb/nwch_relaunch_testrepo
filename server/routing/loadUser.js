/* eslint-disable no-unused-vars */
/**
 * Loads the logged in user (based on `id` in the session cookie) and stores it
 * in `req.user`. If `id` is not set or the user can not be fetched, `req.user`
 * is `null`.
 */
function loadUser(req, res, next) {
  var apiConfig = {
    endpoint: '/content/users/' + req.session.id,
    key: 'user'
  };

  req.api.retrieve(apiConfig);

  next();
}


module.exports = loadUser;
