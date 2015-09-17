module.exports = function(req, componentName) {
  /**
   * Load components based on a request.
   *
   * The module must be initialized with a request containing at least the
   * component name as req.params.component.
   */
  this.req = req;
  if (componentName) {
    this.componentName = componentName;
  } else {
    this.componentName = this._componentName();
  }
  this.variationName = this._variationName();
};

module.exports.prototype.getComponent = function(res) {
  /**
   * Try to get the component.
   *
   * If res is provided res.send is called sending an HTML comment if the
   * component could not be found.
   */
  if (!this.getComponentName(res)) {
    return;
  }
  var component;
  if (this.componentName) {
    component = this.resolveModule(this.componentName, '');
  }
  if (!component && res) {
    res.send('<!-- Component "' + this.componentName + '" not found! -->');
  }
  return component;
};

module.exports.prototype.getSlot = function() {
  /**
   * Provides the slot module of a component.
   */
  if (this.componentName) {
    return this.resolveModule(this.componentName, '/slot');
  }
};

module.exports.prototype.API = function() {
  /**
   * Provides the api module of a component.
   */
  if (this.componentName) {
    return this.resolveModule(this.componentName, '/api');
  }
};

module.exports.prototype.getComponentName = function(res) {
  /**
   * Same as this.componentName but adds an HTML comment to res if no
   * component name is provided.
   */
  if (!this.componentName && res) {
    res.send('<!-- No component name provided! -->');
  }
  return this.componentName;
};

module.exports.prototype._componentName = function() {
  var params = this.req.params || {};
  return params.component;
};

module.exports.prototype.getVariationName = function(res) {
  /**
   * Same as this.variationName but adds an HTML comment to res if no
   * variation name is provided.
   */
  if (!this.variationName && res) {
    res.send('<!-- No variation name provided! -->');
  }
  return this.variationName;
};

module.exports.prototype._variationName = function() {
  var params = this.req.params || {};
  return params.variation;
};

module.exports.prototype.resolveModule = function(componentName, modulePath) {
  try {
    return require('../../app/node_modules/components/' + componentName + modulePath);
  } catch (e) {
  }
};
