var webpack = require('webpack');
var path = require('path');

var config = {
  entry: {
    client: ['./app/vendor.js', './app/client.js'],
    styleguide: ['./app/vendor.js', './app/styleguide.js']
  },
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
    new webpack.EnvironmentPlugin(
      'DISQUS_SHORTNAME',
      'GOLDBACH_SALT',
      'KALTURA_ACCOUNT_ID',
      'KALTURA_AUTOPLAY',
      'KALTURA_PLAYER_ID',
      'KALTURA_PLAYER_NOADS_ID',
      'KALTURA_TRACKING_URL'
    ),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de/)
  ]
};

module.exports = config;
