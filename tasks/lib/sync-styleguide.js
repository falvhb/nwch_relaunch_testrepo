var gulp = require('gulp');
var sassdoc = require('sassdoc');
var fs = require('fs');

module.exports = function syncStyleguideData(src, output, postFn) {
  return gulp
    .src(src)
    .pipe(sassdoc.parse({ verbose: true }))
    .on('data', function(data) {
      fs.writeFileSync(output, JSON.stringify({ sections: postFn(data) }));
    });
};
