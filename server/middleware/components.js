/*eslint-disable no-console */

var glob = require('simple-glob');
var objectAssign = require('react/lib/Object.assign');
var fs = require('fs');
var path = require('path');

var defaults = {
  folder: './app/node_modules',
  extensions: ['index.jsx', 'index.js'],
  ignore: ['styleguide', 'mixins', 'utils', 'demo', 'higher-order', 'helpers', 'iso-react'],
  config: '.config.json',
  data: '.data.json',
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
      var filepath = file.split('/index')[0];
      // Get our sections from URL
      var folders = filepath.split(removeTrailingSlash(options.folder) + '/').pop();
      var foldersArray = folders.split('/');
      var section = foldersArray[0];
      var slug = foldersArray[1];
      // Warn if too much nesting
      if (foldersArray.length > 2) {
        console.warn('Folder structure should not be 2 levels deep for `' + folders + '`');
      }
      // Get README from folder
      var readme, readmePath = path.join(filepath, options.readme);
      if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf8');
      }
      // Get config from folder
      var config, configPath = path.join(filepath, options.config);
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
      // Get data from folder
      var data, dataPath = path.join(filepath, options.data);
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      }
      // Get variations from folder
      var variations, variationsPath = path.join(filepath, options.variations);
      if (fs.existsSync(variationsPath)) {
        variations = JSON.parse(fs.readFileSync(variationsPath, 'utf8'));
      }

      // Compile JSON data
      var json = {
        category: section,
        slug: slug,
        readme: readme,
        variations: variations,
        data: data
      };
      return objectAssign({}, config, json);
    });
    res.locals.components = components;
    next();
  };
};
