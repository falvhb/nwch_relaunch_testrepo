var recaptcha  = require('nodejs-nocaptcha-recaptcha');

module.exports = {
  middleware: function(req, res, next) {
    /**
     * Express middleware to check for a valid recaptcha
     *
     * req.recaptcha will contain the response from recaptcha (true/false)
     *
     * To be able to use this middleware the express urlencoded body-parser must
     * be used and the domain configuration must be loaded.
     * The body must contain the property "g-recaptcha-response". If this
     * property is mising the result recaptcha status is set to false.
     */
    var captchaResponse = req.body["g-recaptcha-response"];
    if (captchaResponse) {
      var domain = req.api.get('domain');
      var key = domain &&
                domain.data &&
                domain.data.properties &&
                domain.data.properties.recaptcha_priv_key || null;
      if (key) {
        recaptcha(captchaResponse,
                  domain.data.properties.recaptcha_priv_key,
                  function (success) {
            req.recaptcha = {status: success};
            next();
          }
        );
      } else {
        req.recaptcha = {
            status: "missing recaptcha private key entry in domain configuration"
        };
        next();
      }
    } else {
      req.recaptcha = {status: "missing g-recaptcha-response in POST body"};
      next();
    }
  },
  form: function(req) {
    var domain = req.api.get('domain');
    var key = domain &&
              domain.data &&
              domain.data.properties &&
              domain.data.properties.recaptcha_pub_key || null;
    if (key) {
      return '<div class="g-recaptcha" data-sitekey="' + key + '"></div>';
    }
    return '<!-- no recaptcha public key in domain configuration -->';
  }
};
