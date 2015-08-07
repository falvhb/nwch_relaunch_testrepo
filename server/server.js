/*eslint-disable no-console, no-unused-vars */

var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var fs = require('fs');
var engines = require('consolidate');
var app = module.exports = express();

// -----------------------------------------------------------------------------
// Environment
// -----------------------------------------------------------------------------

if (fs.existsSync('.env.deploy')) {
  require('dotenv').load({
    path: '.env.deploy'
  });
}
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
app.use('/client', express.static('client'));

// API Middleware
// Registers an API object on req that should be used for all API calls.
app.use(require('./routing/api'));
// middlewares for retrieving data from the REST API
var loadArticle = require('./routing/loadArticle');
var loadDossier = require('./routing/loadDossier');
var loadRessortNav = require('./routing/loadRessortNav');
var loadTopic = require('./routing/loadTopic');
var loadUser = require('./routing/loadUser');

// Routing Middleware
var reactTopicLayoutRouter = require('./routing/routingTopicLayout');
var reactTopicAPIRouter = require('./routing/routingTopicAPI');
var reactDossierRouter = require('./routing/routingDossier');
var reactRessortHeaderRenderer = require('./routing/routingRessortHeader');
var reactComponentsRouter = require('./routing/routingReactComponents');
var nodeIncludesRouter = require('./routing/routingNodeIncludes');


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
app.use('/sassdoc/assets/', express.static('app/sassdoc/assets'));

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

app.use(require('./modules/cookie-session')({
  name: process.env.SESSION_COOKIE,
  secret: process.env.SESSION_SECRET
}));


// -----------------------------------------------------------------------------
// App Routing
//
// NOTE: Order matters here!
// -----------------------------------------------------------------------------

app.get('/favicon.ico', function(req, res) { res.send(''); });

var LAYOUT_PREFIX = '/__layout__';
var API_PREFIX = '/__api__';
var COMPONENT_PREFIX = '';

app.get([API_PREFIX + '/thema/:topicKeyword',
         API_PREFIX + '/thema/:topicKeyword/seite/:page'],
        loadTopic,
        reactTopicAPIRouter);

app.get([LAYOUT_PREFIX + '/thema/:topicKeyword',
         LAYOUT_PREFIX + '/thema/:topicKeyword/seite/:page'],
        loadTopic,
        reactTopicLayoutRouter);

app.get(COMPONENT_PREFIX + '/dossier/:dossier/:component/:variation',
        loadDossier,
        reactDossierRouter);
app.get(COMPONENT_PREFIX + '/:ressort?/ressort-header/:variation?',
        loadRessortNav,
        reactRessortHeaderRenderer);
app.get(COMPONENT_PREFIX + '/:a?/:b?/:c?/:d?/:e?/:viewname(__body_bottom|__head_bottom)',
        nodeIncludesRouter);
app.get(COMPONENT_PREFIX + '/:ressort/:subressort?/:text-:articleId(\\d+)/:component/:variation',
        loadArticle,
        reactComponentsRouter);
app.get(COMPONENT_PREFIX + '/:a?/:b?/:c?/:d?/:e?/:component/:variation',
        reactComponentsRouter);


// catch-all route, throws an error to invoke error handling
app.all('*', function(req, res) {
  throw new Error('unknown route: ' + req.originalUrl);
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


// Start our server
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
  console.log('Web server listening at %s:%s/', server.address().address, server.address().port);
});
