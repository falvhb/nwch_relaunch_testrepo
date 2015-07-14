var gulp = require('gulp');
var sassdoc = require('sassdoc');
var fs = require('fs');
var helpers = require('./helpers.js');

module.exports = function syncStyleguideData(src, output, postFn) {
  if (!helpers.isProduction()) {
    return gulp
      .src(src)
      .pipe(sassdoc.parse({ verbose: true }))
      .on('data', function(data) {
        fs.writeFileSync(output, JSON.stringify({ sections: postFn(data) }));
      });
  }
};
