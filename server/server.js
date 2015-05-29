"use strict";
var loopback = require('loopback');
var boot = require('loopback-boot');
var nunjucks = require('nunjucks');
var path = require('path');
var engines = require('consolidate');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url')); //eslint-disable-line
  });
};


app.set('views', path.resolve(__dirname, '..'));
app.set('view engine', 'html');
app.engine('html', engines.nunjucks);

nunjucks.configure(path.resolve(__dirname, '..'), {
  watch: true,
  autoescape: true
});

app.get('/styleguide', function(req, res) {
  res.render('views/layouts/styleguide.html', {
    title: 'Styleguide',
    content: 'Hello world!'
  });
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
