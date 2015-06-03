/*eslint-disable no-console */
'use strict';

var React = require('react');
var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');
var app = module.exports = loopback();

var slugToTitle = require('slug-to-title');
var objectAssign = require('react/lib/Object.assign');

// Allow requiring of JSX
require('babel/register')({
  ignore: /client/,
  stage: 1,
  extensions: ['.jsx']
});

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// Nunjucks
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

app.set('views', path.resolve(__dirname, '../app'));
app.set('view engine', 'html');
app.engine('html', engines.nunjucks);
app.use('/client', loopback.static('client'));

// -----------------------------------------------------------------------------
// SassDoc
// -----------------------------------------------------------------------------

// Serve SassDoc assets folder
app.use('/sassdoc/assets/', loopback.static('app/sassdoc/assets'));

// SassDoc route
app.get('/sassdoc', function(req, res) {
  res.render('sassdoc/index.html');
});


// -----------------------------------------------------------------------------
// Main app routing
// -----------------------------------------------------------------------------

// Middleware for components
var middleware = require('./middleware/components.js');
app.use(middleware());

// Require the core Styleguide
var Styleguide = require('../app/node_modules/styleguide/layout');

// Json for all components
app.get('/components.json', function(req, res) {
  res.json(res.locals.components);
});

// Core Styleguide route
app.get('/styleguide', function(req, res) {
  // append new props to Styleguide
  var props = {
    components: res.locals.components
  };
  var reactEl = React.createElement(Styleguide, objectAssign({}, props));
  // route rendering
  res.render('layouts/styleguide.html', {
    title: 'AZ Medien Styleguide',
    content: React.renderToString(reactEl)
  });
});

// All our component routes
app.get('/styleguide/component/:component', function(req, res) {
  var components = res.locals.components;
  var slug = req.params.component;
  // append new props to Styleguide
  var props = {
    components: components,
    route: slug
  };
  var reactEl = React.createElement(Styleguide, objectAssign({}, props));
  console.log(props, React.renderToString(reactEl));
  // route rendering
  res.render('layouts/styleguide.html', {
    title: slugToTitle(slug) + ' | AZ Medien Styleguide',
    content: React.renderToString(reactEl)
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
