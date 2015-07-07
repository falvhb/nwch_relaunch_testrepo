var gutil = require('gulp-util');

function isProd() {
  return !!gutil.env.production || !!gutil.env.prod;
}

function isBuild() {
  return gutil.env._[0] === 'build';
}

function onError() {
  gutil.beep();
  console.log(err);
  this.emit('end');
}

var SOURCE_DIR = './app/';
var BUILD_DIR = isProd() ? './__node__/__static__/client/' : './client/';

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
  isProd: isProd,
  isBuild: isBuild,
  onError: onError
};
