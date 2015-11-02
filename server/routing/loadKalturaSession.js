var Kaltura = require('kaltura-client/KalturaClient.js');

/**
 * A middleware to load the Kaltura Session.
 */
module.exports = function(req, res, next) {
  var partnerId = process.env.KALTURA_ACCOUNT_ID;
  var userId = process.env.KALTURA_API_USER;
  var password = process.env.KALTURA_API_PASSWORD;
  var expiry = 86400;
  var privileges;

  var config = new Kaltura.KalturaConfiguration(partnerId);
  var client = new Kaltura.KalturaClient(config);

  client.user.login(
    function(data) {
      var ks = (typeof data === 'string' ? data : 'no-valid-ks');
      req.api.set('kaltura', {kalturaSession: ks});

      next();
    },
    partnerId,
    userId,
    password,
    expiry,
    privileges
  );

};
