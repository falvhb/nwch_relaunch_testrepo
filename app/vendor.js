// bind polyfill for Phantomjs and older browsers
require('polyfill-function-prototype-bind');
require('svg4everybody/svg4everybody');
var Flickity = require('flickity/dist/flickity.pkgd.js');
window.Flickity = Flickity;
