var gulp = require('gulp');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var helpers = require('./lib/helpers.js');
var config = require('../webpack.config.js');

module.exports = function() {

  config.plugins = config.plugins || [];

  if (helpers.isProduction()) {
    delete config.entry.styleguide;
  } else {
    delete config.entry.client;
  }

  if (helpers.isBuild()) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        // output: { comments: false },
        compress: { warnings: false }
      }),
      new webpack.optimize.DedupePlugin()
    );
  } else {
    config.watch = true;
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: helpers.isProduction()
          ? JSON.stringify('production')
          : JSON.stringify('development'),
        STATIC_ASSETS: helpers.isProduction()
          ? '"/__node__/__static__/client"'
          : '"/client"'
      }
    })
  );

  return gulp
    .src(helpers.isProduction() ? config.entry.client : config.entry.styleguide)
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest('./client'));

};
