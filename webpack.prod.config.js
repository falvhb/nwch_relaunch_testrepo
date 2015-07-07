/* eslint-disable no-unused-vars */

var webpack = require('webpack');
var path = require('path');

var config = {
  entry: './app/client.js',
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
    filename: 'client.bundled.js',
    path: path.join(__dirname, './__node__/__static__/client'),
    publicPath: '/__node__/__static__/client/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV', 'STATIC_ASSETS'),
    new webpack.optimize.UglifyJsPlugin({ output: { comments: false } })
  ]
};

module.exports = config;
