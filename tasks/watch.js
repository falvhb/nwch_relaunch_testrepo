var gulp = require('gulp');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  return gulp
    .watch(helpers.sassInput(), require('./sass.js'))
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
};
