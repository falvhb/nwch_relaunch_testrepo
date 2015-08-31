var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';

module.exports = function(config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    // karma only needs to know about the test bundle
    files: [
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests.bundle.js'
    ],
    frameworks: [ 'chai', 'mocha' ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter'
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha' ],
    singleRun: true,
    // webpack config object
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            include: /\/app\//,
            loader: 'babel',
            test: /.jsx?$/
          },
          {
            test: /\.json$/,
            loader: 'json'
          }
        ],
      },
      resolve: {
        extensions: ['', '.js', '.jsx', '.json']
      }
    },
    webpackMiddleware: {
      noInfo: true,
    }
  });
};
