'use strict';

var glob = require('glob');
var objectAssign = require('react/lib/Object.assign');
var fs = require('fs');
var slugToTitle = require('slug-to-title');

var defaults = {
  folder: './app/node_modules/components/',
  extension: '.jsx',
  variations: '.variations.json'
};

module.exports = function(opts) {
  var options = objectAssign({}, defaults, opts);
  return function(req, res, next) {
    var files = glob.sync(options.folder + '**/*' + options.extension);
    var components = files.map(function(file) {
      var path = file.replace('/index' + options.extension, '');
      var slug = path.replace(options.folder, '');
      // Get README from folder
      var readme, readmePath = path + '/README.md';
      if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf8');
      }
      // Get data from folder
      var variations, variationsPath = path + '/' + options.variations;
      if (fs.existsSync(variationsPath)) {
        variations = JSON.parse(fs.readFileSync(variationsPath, 'utf8'));
      }
      return {
        title: slugToTitle(slug),
        slug: slug,
        readme: readme,
        variations: variations
      };
    });
    res.locals.components = components;
    next();
  };
};
