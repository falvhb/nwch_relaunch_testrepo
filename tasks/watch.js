var gulp = require('gulp');
var helpers = require('./lib/helpers.js');
var sassInput = require('./lib/sass-input.js');

module.exports = function() {
  return gulp
    .watch(sassInput, require('./sass.js'))
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
};
