/* eslint-disable no-unused-vars */

var webpack = require('webpack');
var path = require('path');

var config = {
  entry: './app/styleguide.js',
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
    filename: 'styleguide.bundled.js',
    path: path.join(__dirname, './client'),
    publicPath: '/client/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV', 'STATIC_ASSETS')
  ]
};

module.exports = config;
