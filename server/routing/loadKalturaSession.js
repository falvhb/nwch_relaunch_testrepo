var Kaltura = require('kaltura-client/KalturaClient.js');

/**
 * A middleware to load the Kaltura Session.
 */
module.exports = function(req, res, next) {
  var partnerId = '1789881';
  var userId = 'Viewer';
  var password = 'Lfd7sdfhl!@';
  var expiry = 86400;
  var privileges;

  var config = new Kaltura.KalturaConfiguration(partnerId);
  var client = new Kaltura.KalturaClient(config);

  // var secret = process.env.KALTURA_ADMIN_SECRET;
  // var type = Kaltura.enums.KalturaSessionType.ADMIN;
  //
  // client.session.start(
  //   function (ks) {
  //     req.api.set('kaltura', {kalturaSession: ks});
  //     next();
  //   },
  //   secret,
  //   userId,
  //   type,
  //   partnerId,
  //   expiry,
  //   privileges);

  client.user.login(function(data) {
      var ks = (typeof data === 'string' ? data : 'no-valid-ks');
      req.api.set('kaltura', {kalturaSession: ks});

      client.setKs(ks);

      next();
    },
    partnerId,
    userId,
    password,
    expiry,
    privileges);

};
