var nodemon = require('gulp-nodemon');
var pkg = require('../package.json');

// load all env variables
require('dotenv').load({
  path: '.env'
});

module.exports = function() {
  nodemon({
    script: pkg.main,
    watch: ['app/', 'app/node_modules/', 'common/', 'server/'],
    ext: 'jsx js json'
  });
};
