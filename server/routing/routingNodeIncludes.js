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
  /**
   * Gets an HTML file and renderes it with 'nunjucks'
   */
  var skin = req.headers['x-skin'] || "";
  var data = {
    skin: skin
  };
  var component = req.params.viewname;
  res.write(renderNunchuck(component, data));
};

