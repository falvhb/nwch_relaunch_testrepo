var Components = require('../modules/components');
var renderComponent = require('../modules/renderComponent');

module.exports = function(req, res) {

  // require elements
  var c = new Components(req, 'topic-detail');
  c.element = c.getComponent(res);
  c.slot = c.getSlot();

  if (!c.element) return;

  // get data
  var page = parseInt(req.params.page, 10) - 1 || 0;
  if (page < 0) page = 0;

  var result = req.api.get('topic') || {};
  var articles = result && result.data ? result.data : [];

  // map our data
  c.state = {
    'articles': articles,
    'page': page + 1,
    'topic': req.params.topicKeyword,
    'variation': '',
    'total': result.total || 0
  };

  // send component render
  res.send(renderComponent(c));
};
