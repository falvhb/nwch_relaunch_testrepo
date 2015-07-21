var fs = require('fs');
var phantomcss = require('phantomcss');

casper.test.begin( 'AZ Styleguide visual tests', function ( test ) {

  phantomcss.init({
    rebase: casper.cli.get("rebase"),
    // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
    casper: casper,
    libraryRoot: fs.absolute(fs.workingDirectory + ''),
    screenshotRoot: fs.absolute( fs.workingDirectory + '/screenshots' ),
    failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/screenshots/failures' ),
    addLabelToFailedImage: false,
    /*
    screenshotRoot: '/screenshots',
    failedComparisonsRoot: '/failures'
    casper: specific_instance_of_casper,
    libraryRoot: '/phantomcss',
    fileNameGetter: function overide_file_naming(){},
    onPass: function passCallback(){},
    onFail: function failCallback(){},
    onTimeout: function timeoutCallback(){},
    onComplete: function completeCallback(){},
    hideElements: '#thing.selector',
    addLabelToFailedImage: true,
    outputSettings: {
      errorColor: {
        red: 255,
        green: 255,
        blue: 0
      },
      errorType: 'movement',
      transparency: 0.3
    }*/
  } );

  var host = 'http://localhost:8000/';
  var componentPath = 'styleguide/components/';

  var getComponentPreviewURL = function (component) {
    return host + componentPath + component + '/preview';
  };

  casper.on( 'remote.message', function ( msg ) {
    this.echo( msg );
  } )

  casper.on( 'error', function ( err ) {
    this.die( "PhantomJS has errored: " + err );
  } );

  casper.on( 'resource.error', function ( err ) {
    casper.log( 'Resource load error: ' + err, 'warning' );
  } );

  /*
    The test for styleguide component
  */

  var components = ['article-header', 'icon', 'button', 'intro'];

  casper.start();

  casper.viewport( 1024, 768 );


  components.forEach(function (component) {
    casper.thenOpen(getComponentPreviewURL(component));

    casper.wait(1500);

    casper.then(function() {
      phantomcss.screenshot( '.' + component, component );
    });
  });




  casper.then( function compareScreenshots() {
    // compare screenshots
    phantomcss.compareAll();
  });

  /*
  Casper runs tests
  */
  casper.run( function () {
    console.log( '\nTHE END.' );
    // phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  } );
} );
