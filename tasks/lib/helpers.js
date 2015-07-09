var gutil = require('gulp-util');

function isProduction() {
  return gutil.env.production || gutil.env.prod;
}

function isBuild() {
  return gutil.env.build;
}

function onError(err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
}

var SOURCE_DIR = './app/';
var BUILD_DIR = './client/';

function buildDir(path) {
  return BUILD_DIR + path;
}

function sourceDir(path) {
  return SOURCE_DIR + path;
}

function assetDir(path) {
  return sourceDir('assets/' + path);
}

module.exports = {
  SOURCE_DIR: SOURCE_DIR,
  BUILD_DIR: BUILD_DIR,
  sourceDir: sourceDir,
  assetDir: assetDir,
  buildDir: buildDir,
  isProduction: isProduction,
  isBuild: isBuild,
  onError: onError
};
