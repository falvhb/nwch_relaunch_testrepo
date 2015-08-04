/*eslint-disable no-console, no-unused-vars */

var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');
var winston = require('winston');
var app = module.exports = loopback();

// -----------------------------------------------------------------------------
// Environment
// -----------------------------------------------------------------------------

require('dotenv').load({
  path: '.env'
});
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

// API Middleware
// Registers an API object on req that should be used for all API calls.
app.use(require('./routing/api'));
// middlewares for retrieving data from the REST API
var loadArticle = require('./routing/loadArticle');
var loadUser = require('./routing/loadUser');

// Routing Middleware
require('./routing/routingParams')(app);
var reactTopicLayoutRouter = require('./routing/routingTopicLayout');
var reactTopicAPIRouter = require('./routing/routingTopicAPI');
var reactDossierRouter = require('./routing/routingDossier');
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


// -----------------------------------------------------------------------------
// Authentication
//
// We use cookie-session to store the user id as a cookie. The cookie-session
// package allows to sign the cookie (a second cookie <cookie-name>.sig is
// stored containing a hash of <cookie-name>'s value).
// The cookie is set from Zope.
// -----------------------------------------------------------------------------

app.use(require('cookie-session')({
  name: process.env.SESSION_COOKIE,
  secret: process.env.SESSION_SECRET
}));


// -----------------------------------------------------------------------------
// App Routing
//
// NOTE: Order matters here!
// -----------------------------------------------------------------------------

var LAYOUT_PREFIX = '/__layout__';
var API_PREFIX = '/__api__';
var COMPONENT_PREFIX = '';

app.get([API_PREFIX + '/thema/:topicKeyword',
         API_PREFIX + '/thema/:topicKeyword/seite/:page'],
        reactTopicAPIRouter);

app.get([LAYOUT_PREFIX + '/thema/:topicKeyword',
         LAYOUT_PREFIX + '/thema/:topicKeyword/seite/:page'],
        reactTopicLayoutRouter);

app.get(COMPONENT_PREFIX + '/dossier/:dossier/:component/:variation', reactDossierRouter);
app.get(COMPONENT_PREFIX + '/:a?/:b?/:c?/:d?/:e?/:viewname(__body_bottom|__head_bottom)', nodeIncludesRouter);
app.get([COMPONENT_PREFIX + '/:ressort/:subressort?/:text-:articleId(\\d+)/:component/:variation',
         COMPONENT_PREFIX + '/:a?/:b?/:c?/:d?/:e?/:component/:variation'
        ],
        reactComponentsRouter);

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) { throw err; }

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});


// catch-all route, throws an error to invoke error handling
app.all('*', function() {
  throw new Error('unknown route');
});

// error handling
// http://expressjs.com/guide/using-middleware.html
// An error-handling middleware has an arity of 4, which must always be maintained to be
// identified as an error-handling middleware. Even if you don’t need to use the next
// object, make sure specify it to maintain the signature, else it will be interpreted as
// a regular middleware, and fail to handle errors.

// HINT: commented to be able to see errors. uncomment if needed

// app.use(function(err, req, res, next) {
//   app.get('logger').error(err.message + ' (' + req.originalUrl + ')');
//   res.status(200);
//   res.write('<!-- Error while processing "' + req.originalUrl + '" -->\n');
//   res.end();
// });
