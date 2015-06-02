/* eslint-disable no-unused-vars */
'use strict';
var webpack = require('webpack');
var path = require('path');

var config = {
  entry: './views/browser.js',
  watch: true,
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel'],
      },
    ]
  },
  output: {
    filename: 'frontend.bundled.js',
    path: path.join(__dirname, './client'),
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

module.exports = config;
