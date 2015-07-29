var React = require('react');

module.exports = function(req, res) {

  var params = req.params;

  var componentName = 'dossier-header';

  var componentVariation = params.variation;
  if (!componentVariation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }

  // resolve the component
  var component;
  try {
    component = require('../../app/node_modules/components/' + componentName);
  } catch (e) {
    //TODO: uncomment these lines when replacing the dummy component with a real component
    //res.send('<!-- Component "' + componentName + '" not found! -->');
    //return;
  }

  // see if there is a slot function
  // this typically maps data from the full API response -> only the data a component needs
  var slot;
  try {
    slot = require('../../app/node_modules/components/' + componentName + '/slot');
  } catch (e) {
    // not found (is okay, continue)
  }

  // just a dummy component - remove when actual component is ready
  component = React.createClass({
    displayName: 'RessortHeaderDummy',

    render: function() {
      if (!this.props.data.dossier) {
        return React.createElement('div', {}, 'Dossier not found!');
      }
      return React.createElement('div', {},
        React.createElement('h1', {}, this.props.data.dossier.title),
        React.createElement('p', {}, this.props.data.dossier.header.lead),
        React.createElement('div', {}, 'Keywords'),
        React.createElement('ul', {},
          this.props.data.dossier.keywords.map(function(keyword) {
            return React.createElement('li', {}, keyword);
          })
        )
      );
    }
  });


  function render() {
    var result = req.item || {};
    var dossier = result && result.data ? result.data[0] : null;

    var state = {
      'dossier': dossier,
      'variation': componentVariation
    };

    res.send(React.renderToString(React.createElement(component, { data: state })));
  }

  // do the dossier query
  var queryParams = {
    'path': 'dossier-container/' + req.params.dossier
  };

  req.app.models.NewsRessort.query(
    queryParams,
    function(err, result) {
      if (err) {
        req.item = null;
      } else {
        // got a result to render
        req.item = result;
      }
      render();
    }
    );
};
