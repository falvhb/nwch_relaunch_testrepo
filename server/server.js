/*eslint-disable no-console */
'use strict';

var React = require('react');
var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');

var app = module.exports = loopback();

// Allow requiring of JSX
require('babel/register')({
  ignore: /client/,
  stage: 1,
  extensions: ['.jsx']
});

// Nunjucks config
nunjucks.configure(path.resolve(__dirname, '..'), {
  watch: true,
  autoescape: false
});

// Start our server
app.start = function() {
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

app.set('views', path.resolve(__dirname, '..'));
app.set('view engine', 'html');
app.engine('html', engines.nunjucks);
app.use('/client', loopback.static('client'));

// Serve SassDoc assets folder
app.use('/sassdoc/assets', loopback.static('views/sassdoc/assets'));

// SassDoc route
app.get('/sassdoc/', function(req, res) {
  res.render('views/sassdoc/index.html');
});

// Styleguide route
app.get('/styleguide', function(req, res) {
  var Styleguide = require('../views/components/styleguide');
  res.render('views/layouts/styleguide.html', {
    title: 'AZ Medien Styleguide',
    content: React.renderToString(
      React.createElement(Styleguide)
    )
  });
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) { throw err; }

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
