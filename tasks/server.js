var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');
require('dotenv').load();

module.exports = function() {
  nodemon({
    script: pkg.main,
    env: {
      'NODE_ENV': process.env.NODE_ENV,
      'STATIC_ASSETS': process.env.STATIC_ASSETS,
      'DISQUS_API_KEY': process.env.DISQUS_API_KEY
    },
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
