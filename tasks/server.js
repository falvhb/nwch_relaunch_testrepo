var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
var helpers = require('./lib/helpers.js');

module.exports = function() {
  nodemon({
    script: pkg.main,
    // @TODO: move all API keys into .env file – don't keep them in Git
    env: {
      'NODE_ENV': (helpers.isProd() ? 'production' : 'development'),
      'DISQUS_API_KEY': null
    },
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
