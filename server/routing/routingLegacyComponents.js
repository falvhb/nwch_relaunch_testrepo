var React = require('react');
var camelCase = require('camelcase');
var getSkinName = require('../modules/skin');


var Components = function (req, componentName) {
  this.req = req;
  if (componentName) {
    this.componentName = componentName;
  } else {
    this.componentName = this._componentName();
  }
};

Components.prototype.getComponent = function(res) {
  if (!this.getComponentName(res)) {
    return false;
  }
  var component;
  if (this.componentName) {
    component = this.resolveModule(this.componentName, '');
  }
  if (!component && res) {
    res.send('<!-- Component "' + this.componentName + '" not found! -->\n');
  }
  return component;
};

Components.prototype.getSlot = function() {
  if (this.componentName) {
    return this.resolveModule(this.componentName, '/slot');
  }
};

Components.prototype.API = function() {
  if (this.componentName) {
    return this.resolveModule(this.componentName, '/api');
  }
};

Components.prototype.getComponentName = function(res) {
  if (!this.componentName && res) {
    res.send('<!-- No component name provided! -->');
  }
  return this.componentName;
};

Components.prototype._componentName = function() {
  var params = this.req.params || {};
  return params.component;
};

Components.prototype.resolveModule = function(componentName, modulePath) {
  try {
    return require('../../app/node_modules/legacy/components/' + componentName + modulePath);
  } catch (e) {
    //
  }
};


function renderComponent(params) {
  var component = params || {};

  component.componentName = camelCase(params.componentName);

  if (component.slot && typeof(component.slot.data) === 'function') {
    component.data = component.slot.data(component.state);
  } else {
    component.data = component.state;
  }

  var el = React.createElement(component.element, component.data);
  var output = React.renderToStaticMarkup(el, component.data);

  return output;
}


module.exports = function(req, res) {
  var c = new Components(req);
  c.element = c.getComponent(res);
  c.slot = c.getSlot();

  if (!c.element) {
    return;
  }

  req.article = req.api.get('article');

  if (req.article && !req.article.data) {
    res.write('<!-- Article"' + req.params.articleId + '" not found! -->\n');
    var errors = req.article.errors;
    if (errors && errors.length > 0) {
      res.write('<!-- Error detail: ' + errors[0].detail + ' -->\n');
    }
    res.end();
    return;
  }


  c.state = {
    'article': req.article ? req.article.data : null,
    'skin': getSkinName(req),
    'path': req._parsedUrl.path
  };

  res.send(renderComponent(c));
};
