var sassInput = require('./lib/sass-input.js');
var sassCompile = require('./lib/sass-compile.js');

module.exports = sassCompile(sassInput.styleguide, 'styles/styleguide.css');
