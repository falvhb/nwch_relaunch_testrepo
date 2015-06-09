'use strict';

var glob = require('simple-glob');
var objectAssign = require('react/lib/Object.assign');
var fs = require('fs');
var slugToTitle = require('slug-to-title');

var defaults = {
  folder: './app/node_modules',
  extensions: ['.jsx', '.js'],
  ignore: ['styleguide', 'layouts'],
  variations: '.variations.json',
  readme: 'README.md'
};

module.exports = function(opts) {
  var options = objectAssign({}, defaults, opts);
  return function(req, res, next) {

    var removeTrailingSlash = function(string) {
      return string.replace(/\/$/, '');
    };

    var stripSlashes = function(string) {
      return string.replace('/', '');
    };

    var include = options.extensions.map(function(extension) {
      return options.folder + '/**/*' + extension;
    });

    var exclude = options.ignore.map(function(folder) {
      return '!' + options.folder + '/' + stripSlashes(folder) + '/**';
    });

    var pattern = include.concat(exclude);
    var files = glob(pattern);

    var components = files.map(function(file) {
      var path = file.split('/index')[0];
      var filename = file.split('/').pop();
      var sections = path.split(removeTrailingSlash(options.folder) + '/').pop();
      var section = sections.split('/')[0];
      var slug = sections.split('/')[1];
      // Get README from folder
      var readme, readmePath = path + '/' + options.readme;
      if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf8');
      }
      // Get data from folder
      var variations, variationsPath = path + '/' + options.variations;
      if (fs.existsSync(variationsPath)) {
        variations = JSON.parse(fs.readFileSync(variationsPath, 'utf8'));
      }
      // Return it
      return {
        path: path,
        file: filename,
        section: section,
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
