var gulp = require('gulp');
var sassInput = require('./lib/sass-input.js').concat('node_modules/dashboard/**/*.scss');

module.exports = function() {
  return gulp
    .watch(sassInput, ['sass', 'sass:dashboard'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...'); //eslint-disable-line
    });
};
