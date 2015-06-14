/*eslint-disable no-console */
'use strict';

var glob = require('simple-glob');
var objectAssign = require('react/lib/Object.assign');
var fs = require('fs');

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

    var components = {};
    files.map(function(file) {
      var path = file.split('/index')[0];
      var filename = file.split('/').pop();
      // Get our sections from URL
      var sections = path.split(removeTrailingSlash(options.folder) + '/').pop();
      var paths = sections.split('/');
      // Warn if too much nesting
      if (paths.length > 2) {
        console.warn('Folder structure cannot be 2 levels deep for ' + path + '. Categories can only be a direct sub-folder of `node_modules`.');
        return;
      }
      var section = paths[0];
      var slug = paths[1];
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
      // Compile JSON data
      var data = {
        path: path,
        file: filename,
        category: section,
        slug: slug,
        readme: readme,
        variations: variations
      };
      // Create category if it doesn't exist
      if (!components[section]) {
        components[section] = [];
      }
      // Push our data
      components[section].push(data);
    });
    res.locals.components = components;
    next();
  };
};
