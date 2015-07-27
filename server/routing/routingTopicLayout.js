var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');

module.exports = function(req, res) {
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page < 0) {
    page = 0;
  }

  function render() {
    var result = req.item || {};
    var articles = result && result.data ? result.data : [];
    var keyword = req.params.topicKeyword;

    var componentName = 'topic-detail';
    var componentVariation = '';

    // map our data
    var state = {
      'articles': articles,
      'page': page + 1,
      'topic': keyword,
      'variation': componentVariation,
      'total': result.total || 0
    };

    // resolve the component
    var component;
    try {
      component = require('../../app/node_modules/components/' + componentName);
    } catch (e) {
      res.send('<!-- Component "' + componentName + '" not found! -->');
      return;
    }

    // see if there is a slot function
    // this typically maps data from the full API response -> only the data a component needs
    var slot;
    try {
      slot = require('../../app/node_modules/components/' + componentName + '/slot');
    } catch (e) {
      // not found (is okay, continue)
    }

    // wrap component in isomorphic layer
    // injects data to DOM and attaches component id
    // component re-rendered client-side via app/client.js
    var iso = new Iso();
    var isoWrapped = iso.wrap({
      component: component,
      state: slot ? slot(state) : state,
      meta: {
        id: camelCase(componentName),
        variation: componentVariation
      }
    });

    res.send(isoWrapped);
  }

  // Do the topic query
  var queryParams = {
    'keywords': req.params.topicKeyword,
    'domain': req.headers['x-skin'] || 'aaz',
    'offset': page * 12,
    'limit': 12,
  };
  req.app.models.PublishedNewsArticle.query(
    queryParams,
    function(err, result) {
      if (err) {
        // There was an error calling the API, we will render the page anyway
        // but without articles.
        req.item = null;
      } else {
        // got a result to render
        req.item = result;
      }
      render();
    }
  );
};
