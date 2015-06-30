/* eslint-disable no-unused-vars */

var webpack = require('webpack');
var path = require('path');

var config = {
  entry: {
    client: './app/client.js',
    styleguide: './app/styleguide.js'
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel'],
      },
      {
        test: /\.json$/,
        loaders: ['json'],
      },
    ]
  },
  output: {
    filename: '[name].bundled.js',
    path: path.join(__dirname, './client'),
    publicPath: '/client/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};

module.exports = config;
