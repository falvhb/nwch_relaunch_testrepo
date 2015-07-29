var React = require('react');

module.exports = function(req, res) {

  var params = req.params;

  var componentName = 'dossier-header';
  if (!componentName) {
    res.send('<!-- No component name provided! -->');
    return;
  }
  var componentVariation = params.variation;
  if (!componentVariation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }
  var component;
  try {
    component = require('../../app/node_modules/components/' +componentName);
  } catch (e) {
    // uncomment these lines when replacing the dummy component below with an actual component
    //res.send('<!-- Component "' + componentName + '" not found! -->');
    //return;
  }
  // var slot;
  // try {
  //   slot = require('../../app/node_modules/components/' + componentName + '/slot');
  // } catch (e) {
  //   // not found (is okay, continue)
  // }

  // just a dummy component to render - remove when actual component is ready
  component = React.createClass({
    displayName: 'RessortHeaderDummy',

    render: function() {
      return React.createElement('div', {}, this.props.data.dossier.data[0] ? JSON.stringify(this.props.data.dossier.data[0].header) : '');
    }
  });


  // Do what needs to be done to render the component.
  function render() {
    var state = {
      'dossier': req.item,
      'variation': componentVariation
    };

    var element = React.createElement(component, { data: state });

    res.send(React.renderToString(element));
  }

  // Fetch the dossier and call render() afterwards.
  req.app.models.NewsRessort.query(
    { path: 'dossier-container/' + req.params.dossier },
    function(err, result) {
      if (err) {
        req.item = null;
      } else {
        req.item = result;
      }
      render();
    }
  );
};
