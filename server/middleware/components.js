'use strict';

var glob = require('glob');
var objectAssign = require('react/lib/Object.assign');

var defaults = {
  folder: './app/node_modules/components/',
  extension: '.jsx'
};

module.exports = function(opts) {
  var options = objectAssign({}, defaults, opts);
  return function(req, res, next) {
    var files = glob.sync(options.folder + '**/*' + options.extension);
    var components = files.map(function(file) {
      var path = file.replace('/index' + options.extension, '');
      var slug = path.replace(options.folder, '');
      var component = {};
      component.slug = slug;
      component.path = path;
      return component;
    });
    res.locals.components = components;
    next();
  };
};
