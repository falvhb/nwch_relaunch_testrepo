var camelCase = require('camelcase');
var Iso = require('../../app/node_modules/iso-react');
var Components = require('../modules/components');

module.exports = function(req, res) {
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page < 0) {
    page = 0;
  }

  var result = req.api.get('topic') || {};
  var articles = result && result.data ? result.data : [];
  var keyword = req.params.topicKeyword;
  var componentName = 'topic-detail';

  var c = new Components(req, componentName);
  var component = c.getComponent(res);
  if (!component) {
    return;
  }
  var slot = c.slot();

  // map our data
  var state = {
    'articles': articles,
    'page': page + 1,
    'topic': keyword,
    'variation': '',
    'total': result.total || 0
  };

  // wrap component in isomorphic layer
  // injects data to DOM and attaches component id
  // component re-rendered client-side via app/client.js
  var iso = new Iso();
  var isoWrapped = iso.wrap({
    component: component,
    state: slot ? slot(state) : state,
    meta: {
      id: camelCase(componentName),
      variation: ''
    }
  });

  res.send(isoWrapped);
};
