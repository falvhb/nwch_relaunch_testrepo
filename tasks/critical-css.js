var helpers = require('./lib/helpers.js');
var path = require( 'path' );
var criticalcss = require('criticalcss');

var cssPath = path.join( helpers.BUILD_DIR, 'styles.css' );
var pageUrl = 'http://localhost:8000/styleguide/pages/article/preview';

module.exports = function () {
  criticalcss.getRules(cssPath, function(err, output) {
    var rules, options;

    if (err) {
      throw new Error(err);
    } else {
      rules = JSON.parse(output);
      options = {
        rules: rules,
        ignoreConsole: true,
        width: 1200,
        height: 1000,
        forceInclude: ['.article-detail']
      };
      /*eslint-disable no-shadow */
      criticalcss.findCritical(pageUrl, options, function(err, output) {
        if (err) {
          /*eslint-disable no-console */
          console.error(err);
          throw new Error(err);
        } else {
          console.log(output);
        }
      });
    }
  });

};




