/*eslint-disable no-warning-comments*/
var path = require('path');

var defaults = {
  folder: './app/includes'
};

var nunjucks = require('nunjucks');

function renderNunchuck(component, data) {
  var templateSlug = component && component.toLowerCase() || '';
  var template = path.join(defaults.folder, templateSlug + '.html');
  return nunjucks.render(template, data);
}

module.exports = function nodeIncludesRouter(req, res) {
  var component = req.params.viewname;
  res.send(renderNunchuck(component));
};

