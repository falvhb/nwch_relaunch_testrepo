module.exports = function(req, res) {

  var params = req.params || {};

  var componentName = params.component;
  if (!componentName) {
    res.send('<!-- No component name provided! -->');
    return;
  }
  var componentVariation = params.variation;
  if (!componentVariation) {
    res.send('<!-- No variation name provided! -->');
    return;
  }

  function render() {
  }

  render();
};
