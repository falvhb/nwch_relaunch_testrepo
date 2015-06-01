var webpack = require('webpack');
var path = require('path');

var config = {
  entry: './views/browser.jsx',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel'],
      },
    ]
  },
  output: {
    filename: 'browser.js',
    path: path.join(__dirname, './client'),
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

module.exports = config;
