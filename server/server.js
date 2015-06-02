/*eslint-disable no-console */
'use strict';

var React = require('react');
var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');
var app = module.exports = loopback();

var glob = require('glob');
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

// Middleware?
var options = {
  folder: './app/node_modules/components/',
  file: 'index.jsx'
};
var files = glob.sync(options.folder + '**/*.jsx');
var components = files.map(function(file) {
  var requirePath = file.replace('/' + options.file, '');
  var componentSlug = requirePath.replace(options.folder, '');
  var componentName = slugToTitle(componentSlug);
  var component = {};
  component.componentName = componentName;
  component.requirePath = requirePath;
  component.componentSlug = componentSlug;
  return component;
});

// Require the core Styleguide
var Styleguide = require('../app/node_modules/styleguide/layout');
var styleguideProps = this.props;

// Core Styleguide route
app.get('/styleguide', function(req, res) {
  // append new props to Styleguide
  var newProps = {
    components: components
  };
  var reactEl = React.createElement(Styleguide, objectAssign({}, styleguideProps, newProps));
  // route rendering
  res.render('layouts/styleguide.html', {
    title: 'AZ Medien Styleguide',
    content: React.renderToString(reactEl)
  });
});

// Loop all our component routes
components.forEach(function(component) {
  app.get('/styleguide/component/' + component.componentSlug, function(req, res) {
    // append new props to Styleguide
    var newProps = {
      components: components,
      displaying: [component]
    };
    console.log(newProps);
    var reactEl = React.createElement(Styleguide, objectAssign({}, styleguideProps, newProps));
    // route rendering
    res.render('layouts/styleguide.html', {
      title: component.componentName + ' | AZ Medien Styleguide',
      content: React.renderToString(reactEl)
    });
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
