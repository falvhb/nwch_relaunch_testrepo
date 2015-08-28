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
        test: /\.jsx?/,
        loaders: ['babel'],
        include: /\/app|server|tasks|test\//
      },
      {
        test: /\.json$/,
        loaders: ['json'],
      },
      {
        test: /flickity/,
        loader: 'imports?define=>false&this=>window'
      }
    ]
  },
  output: {
    filename: '[name].bundled.js',
    path: path.join(__dirname, './client'),
    publicPath: '/client/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'STATIC_ASSETS',
      'PAGINATED',
      'GOLDBACH_SALT',
      'WUFOO_USERNAME',
      'WUFOO_FEEDBACK_FORM',
      'DISQUS_SHORTNAME',
      'KALTURA_ACCOUNT_ID',
      'KALTURA_AUTOPLAY',
      'KALTURA_PLAYER_ID',
      'KALTURA_PLAYER_NOADS_ID',
      'KALTURA_TRACKING_URL'
    ]),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de$/)
  ]
};

module.exports = config;
