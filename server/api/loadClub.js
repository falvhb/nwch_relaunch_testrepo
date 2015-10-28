module.exports = function(req) {
  /**
   * Trigger the API call to load a club.
   *
   * Uses req.api to activate the request.
   */
  var urlparts = req.params.club_urlpart.split('-');
  var club_id = urlparts[urlparts.length - 1];
  var apiConfig = {
    endpoint: '/content/clubs/' + club_id,
    key: 'club'
  };
  // console.log(apiConfig.endpoint);
  req.api.retrieve(apiConfig);
};
