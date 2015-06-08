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
var allComponents = require('./middleware/components');
var componentForRequest = require('./middleware/componentForRequest');
app.use(allComponents());

// Json for all components
app.get('/components.json', function(req, res) {
  res.json(res.locals.components);
});

// Render for react
var Layout = require('../app/node_modules/styleguide/layout');
var LayoutFull = require('../app/node_modules/styleguide/layout-full');

var renderReact = function(params) {

  // Define layout
  // LATER: move to Nunjucks layout ?
  var layout = params.full === true ? LayoutFull : Layout;

  // Create element to be passed as child
  var child, elData;
  var component = params.component;
  if (component) {
    var module = '../app/node_modules/components/' + component.slug;
    // Attach data to component
    if (component.variations) {
      elData = component.variations[component.variationIndex].data;
    }
    child = React.createElement(require(module), objectAssign({}, elData));
  }

  // Create our styleguide
  var el = React.createElement(layout, objectAssign({}, params), child);
  return React.renderToString(el);
};

// Core Styleguide route
app.get('/styleguide', function(req, res) {
  res.render('layouts/styleguide.html', {
    title: 'AZ Medien Styleguide',
    content: renderReact({
      components: res.locals.components
    })
  });
});

// All our component routes
app.get('/styleguide/component/:component', function(req, res) {
  res.render('layouts/styleguide.html', {
    title: slugToTitle(req.params.component) + ' | AZ Medien Styleguide',
    content: renderReact({
      components: res.locals.components,
      component: componentForRequest(req.params, res.locals.components)
    })
  });
});

app.get('/styleguide/component/:component/full', function(req, res) {
  res.render('layouts/styleguide.html', {
    title: slugToTitle(req.params.component) + ' | AZ Medien Styleguide',
    content: renderReact({
      components: res.locals.components,
      component: componentForRequest(req.params, res.locals.components),
      full: true
    })
  });
});

app.get('/styleguide/component/:component/:variation', function(req, res) {
  res.render('layouts/styleguide.html', {
    title: slugToTitle(req.params.component) + ' | AZ Medien Styleguide',
    content: renderReact({
      components: res.locals.components,
      component: componentForRequest(req.params, res.locals.components)
    })
  });
});

// Full view for each component
app.get('/styleguide/component/:component/:variation/full', function(req, res) {
  res.render('layouts/styleguide.html', {
    title: slugToTitle(req.params.component) + ' | AZ Medien Styleguide',
    content: renderReact({
      components: res.locals.components,
      component: componentForRequest(req.params, res.locals.components),
      full: true
    })
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
