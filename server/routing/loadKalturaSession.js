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

  // @TODO: use multirequest for performance gains
  client.startMultiRequest();

  client.user.login(
    function() {},
    partnerId,
    userId,
    password,
    expiry,
    privileges
  );

  // req.api.set('kaltura', {_client: client});

  client.doMultiRequest(function(data) {
    console.info('+++++++++ MultiRequest done.', data);

    var data1 = data[0];
    var ks = (typeof data1 === 'string' ? data1 : 'no-valid-ks');
    req.api.set('kaltura', {kalturaSession: ks});

    // client.setKs(ks);

    next();
  });

};
