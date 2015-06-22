/*eslint-disable no-console */
'use strict';


var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');
var app = module.exports = loopback();

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

var isDevelopment = process.env.NODE_ENV === 'development';


// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// Allow requiring of JSX
require('babel/register')({
  ignore: /client/,
  stage: 1,
  extensions: ['.jsx']
});

// Nunjucks
nunjucks.configure(path.resolve(__dirname, '..'), {
  watch: isDevelopment,
  autoescape: false
});

app.set('views', path.resolve(__dirname, '../app'));
app.set('view engine', 'html');
app.engine('html', engines.nunjucks);
app.use('/client', loopback.static('client'));

// Middleware
var routing = require('./middleware/routing');
var components = require('./middleware/components');
app.use(components());

// Start our server
app.start = function() {
  var port = process.env.PORT || 8000;
  return app.listen(port, function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

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
// Components JSON
// -----------------------------------------------------------------------------

app.get('/components.json', function(req, res) {
  res.json(res.locals.components);
});


// -----------------------------------------------------------------------------
// App Routing
// -----------------------------------------------------------------------------

app.get('/styleguide', routing());
app.get('/styleguide/:category/:component', routing());
app.get('/styleguide/:category/:component/preview', routing());
app.get('/styleguide/:category/:component/:variation', routing());
app.get('/styleguide/:category/:component/:variation/preview', routing());

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) { throw err; }

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
