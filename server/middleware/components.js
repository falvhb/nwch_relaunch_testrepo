'use strict';

var glob = require('glob');
var objectAssign = require('react/lib/Object.assign');
var fs = require('fs');
var slugToTitle = require('slug-to-title');

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
      // Get README from folder
      var readme, readmePath = path + '/README.md';
      if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf8');
      }
      // Get data from folder
      var data, dataPath = path + '/.data.json';
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
      return {
        title: slugToTitle(slug),
        slug: slug,
        readme: readme,
        data: data
      };
    });
    res.locals.components = components;
    next();
  };
};
