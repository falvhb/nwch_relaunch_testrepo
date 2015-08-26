var renderComponent = require('../helpers/renderComponent');

module.exports = function(req, res) {

  var params = req.params || {};

  var componentName = 'topic-detail';
  var componentVariation = params.variation || 'default';

  if (!componentName) {
    res.send('<!-- No component name provided! -->');
    return;
  }

  if (!componentVariation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }

  // resolve the component
  var component;
  try {
    component = require('../../app/node_modules/components/' + componentName);
  } catch (e) {
    res.send('<!-- Component "' + componentName + '" not found! -->');
    return;
  }

  // see if there is a slot function
  // this maps data from the full API response -> only the data a component needs
  var slot;
  try {
    slot = require('../../app/node_modules/components/' + componentName + '/slot');
  } catch (e) {
    // not found (is okay, continue)
  }

  function render() {
    var result = req.api.get('topic') || {};

    var articles = result && result.data ? result.data : [];
    var keyword = req.params.topicKeyword;

    var page = parseInt(req.params.page, 10) - 1 || 0;
    if (page < 0) page = 0;

    var state = {
      'articles': articles,
      'page': page + 1,
      'topic': keyword,
      'variation': componentVariation,
      'total': result.total || 0
    };

    var output = renderComponent({
      componentElement: component,
      componentName: componentName,
      componentVariation: componentVariation,
      state: state,
      slot: slot
    });

    res.send(output);
  }

  render();
};
