var renderComponent = require('../helpers/renderComponent');

module.exports = function(req, res) {

  var params = req.params || {};

  var component = {};

  component.name = 'topic-detail';
  component.variation = params.variation || 'default';

  if (!component.name) {
    res.send('<!-- No component name provided! -->');
    return;
  }

  if (!component.variation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }

  // resolve the component
  try {
    component.element = require('../../app/node_modules/components/' + component.name);
  } catch (e) {
    res.send('<!-- Component "' + component.name + '" not found! -->');
    return;
  }

  // see if there is a slot function
  // this maps data from the full API response -> only the data a component needs
  try {
    component.slot = require('../../app/node_modules/components/' + component.name + '/slot');
  } catch (e) {
    // not found (is okay, continue)
  }

  function render() {
    var result = req.api.get('topic') || {};

    var articles = result && result.data ? result.data : [];
    var keyword = req.params.topicKeyword;

    var page = parseInt(req.params.page, 10) - 1 || 0;
    if (page < 0) page = 0;

    component.state = {
      'articles': articles,
      'page': page + 1,
      'topic': keyword,
      'variation': component.variation,
      'total': result.total || 0
    };

    res.send(renderComponent(component));
  }

  render();
};
