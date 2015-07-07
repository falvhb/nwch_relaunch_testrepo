/*eslint-disable no-console */

var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');
var winston = require('winston');
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

app.set('x-powered-by', false);
app.set('views', path.resolve(__dirname, '../app'));
app.set('view engine', 'html');
app.engine('html', engines.nunjucks);
app.use('/client', loopback.static('client'));

// Routing Middleware
require('./routing/routingParams')(app);
var reactComponentsRouter = require('./routing/routingReactComponents');
var nodeIncludesRouter = require('./routing/routingNodeIncludes');

// Start our server
app.start = function() {
  var port = process.env.PORT || 8000;
  return app.listen(port, function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { 'timestamp': true });
app.set('logger', winston);

// -----------------------------------------------------------------------------
// App Routing
// -----------------------------------------------------------------------------

app.get('/:ressort/:subressort?/:placeholder/:viewname(__body_bottom|__head_bottom)', nodeIncludesRouter);
app.get('/:ressort/:subressort?/:text-:articleId(\\d+)/:component/:variation', reactComponentsRouter);

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) { throw err; }

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});


// -----------------------------------------------------------------------------
// Styleguide Routing / Json
// -----------------------------------------------------------------------------

var components = require('./styleguide/components');
var styleguideRoute = require('./styleguide/routing');

app.get('/styleguide', styleguideRoute);
app.get('/styleguide/:category/:component', styleguideRoute);
app.get('/styleguide/:category/:component/preview', styleguideRoute);
app.get('/styleguide/:category/:component/:variation', styleguideRoute);
app.get('/styleguide/:category/:component/:variation/preview', styleguideRoute);
app.get('/styleguide/components.json', function(req, res) {
  res.json(components);
});

// -----------------------------------------------------------------------------
// SassDoc
// -----------------------------------------------------------------------------

// Serve SassDoc assets folder
app.use('/sassdoc/assets/', loopback.static('app/sassdoc/assets'));

// SassDoc route
app.get('/sassdoc', function(req, res) {
  res.render('sassdoc/index.html');
});


// catch-all route, throws an error to invoke error handling
app.all('*', function() {
  throw new Error('unknown route');
});

// error handling
app.use(function(err, req, res) {
  app.get('logger').error(err.message + ' (' + req.originalUrl + ')');
  res.status(200);
  res.write('<!-- Error while processing "' + req.originalUrl + '" -->\n');
  res.end();
});
