/*eslint-disable no-console */

var Iso = require('iso');
var iso = new(Iso);

module.exports = function(req, res, next) {
  res.locals.iso = iso;
  next();
};
