var Kaltura = require('kaltura-client/KalturaClient.js');

/**
 * A middleware to load the Kaltura Session.
 */
module.exports = function(req, res, next) {
  var accountID = '1789881';
  var secret = process.env.KALTURA_ADMIN_SECRET;
  var userId = 'API3rdPartyAdmin';
  var expiry = 86400;
  var privileges;

  var config = new Kaltura.KalturaConfiguration(accountID);
  var client = new Kaltura.KalturaClient(config);
  var type = Kaltura.enums.KalturaSessionType.ADMIN;
  client.session.start(
    function (ks) {
      req.api.set('kaltura', {kalturaSession: ks});
      next();
    },
    secret,
    userId,
    type,
    accountID,
    expiry,
    privileges);
};
