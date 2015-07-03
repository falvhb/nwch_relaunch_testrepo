/* eslint-disable no-console, no-shadow */

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var fs = require('fs');
var del = require('del');
var pkg = require('./package.json');
var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sassdoc = require('sassdoc');
var _ = require('lodash');
var karma = require('karma').server;


// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

var SOURCE_DIR = './app/';
var BUILD_DIR  = './client/';

var sourceDir = function(path) {
  return SOURCE_DIR + path;
};

var assetDir = function(path) {
  return sourceDir('assets/' + path);
};

var buildDir = function(path) {
  return BUILD_DIR + path;
};


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

var isProd = (function() {
  return !!plugins.util.env.production || !!plugins.util.env.prod;
}());

var isBuild = (function() {
  return plugins.util.env._[0] === 'build';
}());

// Don't break watch on error
var onError = function(err) {
  plugins.util.beep();
  console.log(err);
  this.emit('end');
};

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var sassInput = (function() {
  var input = [
    assetDir('styles/globals.scss'),
    assetDir('styles/base/*.scss'),
    sourceDir('node_modules/base/**/*.scss'),
    sourceDir('node_modules/components/**/*.scss')
  ];

  if (!isProd) {
    input.push(assetDir('styles/vendor/prism.scss'));
    input.push(sourceDir('node_modules/styleguide/**/styles/main.scss'));
  }

  return input;
}());

var jsInput = [
  assetDir('scripts/**/*.js'),
  sourceDir('node_modules/**/*.js'),
  sourceDir('node_modules/**/*.jsx'),
  './server/**/*.js',
  './*.js'
];

var fontsInput = assetDir('fonts/**/*.css');

var sassOptions = {
  outputStyle: (isProd ? 'compressed' : 'expanded'),
  errLogToConsole: isProd === true,
  includePaths: [
    sourceDir('components'),
    assetDir('styles')
  ]
};

var sassdocOptions = {
  dest: sourceDir('sassdoc'),
  config: './.sassdocrc',
  verbose: true
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'IE 9', '> 5%', 'Firefox ESR']
};

var webpackConfig = (function() {
  var config = require('./webpack.config.js');

  if (isBuild || isProd) {
    config.watch = false;
  } else {
    config.plugins = false;
  }

  return config;
}());


// -----------------------------------------------------------------------------
// Clear build folder
// -----------------------------------------------------------------------------

gulp.task('clean', function(cb) {
  del([BUILD_DIR], cb);
});


// -----------------------------------------------------------------------------
// Linting
// -----------------------------------------------------------------------------

gulp.task('eslint', function() {
  return gulp
    .src(jsInput)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('scss-lint', function() {
  return gulp
    .src(sassInput)
    .pipe(plugins.scssLint({ config: './.scss-lint.yml' }))
    .pipe(plugins.scssLint.failReporter());
});

gulp.task('lint', ['eslint', 'scss-lint']);


// -----------------------------------------------------------------------------
// Sass bundle
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
  return gulp
    .src(sassInput)
    .pipe(plugins.plumber({ errorHandler: onError }))
    .pipe(plugins.sass(sassOptions))
    .pipe(plugins.concat('styles.css'))
    .pipe(plugins.autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(BUILD_DIR))
    .pipe(plugins.util.env.livereload ? plugins.livereload() : plugins.util.noop());
});

gulp.task('sassdoc', function() {
  return gulp
    .src([
      assetDir('styles/utilities/*.scss'),
      sourceDir('components/**/styles/utilities/*.scss')
    ])
    .pipe(sassdoc(sassdocOptions))
    .resume();
});


// -----------------------------------------------------------------------------
// Webpack bundle
// -----------------------------------------------------------------------------

gulp.task('webpack', function() {
  return gulp
    .src(sourceDir('browser.js'))
    .pipe(plugins.webpack(webpackConfig))
    .pipe(gulp.dest(BUILD_DIR));
});


// -----------------------------------------------------------------------------
// Fonts bundle
// -----------------------------------------------------------------------------

gulp.task('fonts', function() {
  return gulp
    .src(fontsInput)
    .pipe(plugins.base64({
      baseDir: assetDir('fonts'),
      maxImageSize: 200 * 1024,
      extensionsAllowed: ['woff', 'woff2'],
      debug: true
    }))
    .pipe(gulp.dest(buildDir('fonts')));
});

gulp.task('fontloader', function() {
  return gulp
    .src(assetDir('scripts/**/*.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest(buildDir('scripts')));
});


// -----------------------------------------------------------------------------
// Watch task
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
  if (plugins.util.env.livereload) {
    plugins.livereload.listen();
  }

  return gulp
    .watch(sassInput, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


// -----------------------------------------------------------------------------
// Node server
// -----------------------------------------------------------------------------

gulp.task('server', function() {
  plugins.nodemon({
    script: pkg.main,
    env: { 'NODE_ENV': (isProd ? 'production' : 'development') }
  })
  .on('start', plugins.livereload.reload)
  .on('change', plugins.livereload.reload);
});


// -----------------------------------------------------------------------------
// Icons spriting
// -----------------------------------------------------------------------------

gulp.task('icons', function() {
  return gulp
    .src(assetDir('images/icons/*.svg'))
    .pipe(plugins.wrap(function(data) {
      var name = path.basename(data.file.path, '.svg');
      return '<symbol id="' + name + '" viewbox="0 0 20 20"><title>' + name + '</title><%= contents %></symbol>';
    }))
    .pipe(plugins.concat('icons.svg'))
    .pipe(plugins.wrap('<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"><%= contents %></svg>'))
    .pipe(gulp.dest(buildDir('images')));
});


// -----------------------------------------------------------------------------
// Logo
// -----------------------------------------------------------------------------

gulp.task('logo', function() {
  return gulp
    .src(assetDir('images/az-nwch-logo.svg'))
    .pipe(gulp.dest(buildDir('images/')));
});

// -----------------------------------------------------------------------------
// Logo
// -----------------------------------------------------------------------------

gulp.task('test', function(done) {
  karma.start({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done);
});


// -----------------------------------------------------------------------------
// Styleguide
// -----------------------------------------------------------------------------

function postDataTypography(data) {
  return data
    .filter(function(item) { return item.context.name.match(/^type-/); })
    .map(function(item) {
      return {
        props: {
          title: item.example[0].description,
          description: item.description.replace('\n', ''),
          code: '.' + item.context.name + ' {' + item.context.code + '}'
        },
        content: item.example[0].code
      };
    });
}

function postDataColors(data) {
  return _
    .chain(data)
    .filter(function(item) {
      return item.group[0] === 'colors';
    })
    .map(function(item) {
      var chunks = item.description.split('\n');
      var first = chunks[0].split(' from ');

      return {
        name: first[0],
        value: item.context.value,
        description: chunks.slice(1).join(''),
        palette: first[1]
      };
    })
    .groupBy('palette')
    .map(function(item, value) {
      return {
        title: value,
        colors: item
      };
    })
    .value();
}

function syncStyleguideData(src, output, postFn) {
  return gulp
    .src(src)
    .pipe(sassdoc.parse({ verbose: true }))
    .on('data', function(data) {
      fs.writeFileSync(output, JSON.stringify({ sections: postFn(data) }));
    });
}

gulp.task('sync-styleguide:typography', function() {
  return syncStyleguideData(
    assetDir('styles/utilities/mixins.scss'),
    sourceDir('node_modules/base/typography/.data.json'),
    postDataTypography
  );
});

gulp.task('sync-styleguide:colors', function() {
  return syncStyleguideData(
    assetDir('styles/utilities/variables.scss'),
    sourceDir('node_modules/base/colors/.data.json'),
    postDataColors
  );
});

// -----------------------------------------------------------------------------
// Styleguide task
// -----------------------------------------------------------------------------

gulp.task('styleguide', ['sync-styleguide:typography', 'sync-styleguide:colors']);


// -----------------------------------------------------------------------------
// <head> task
// -----------------------------------------------------------------------------

gulp.task('assets', plugins.sequence('clean', ['fonts', 'fontloader', 'icons', 'styleguide', 'logo']));


// -----------------------------------------------------------------------------
// Bundle task
// -----------------------------------------------------------------------------

gulp.task('bundle', ['sass', 'webpack']);


// -----------------------------------------------------------------------------
// Build task
// -----------------------------------------------------------------------------

// LATER: re-add 'test' to build task
gulp.task('build', plugins.sequence('assets', ['bundle']));


// -----------------------------------------------------------------------------
// Default task (run $ gulp setup before starting development)
// -----------------------------------------------------------------------------

gulp.task('default', plugins.sequence('server', 'watch', 'bundle'));
