module.exports = function getSkinName(req, raw) {
  var name = req.headers && req.headers['x-skin'];
  if (!name) {
    name = 'aaz2016';
  }
  if (!raw) {
    var pattern = /2016$/;
    if (pattern.test(name)) {
      if (!raw && name.endsWith('2016')) {
        name = name.substr(0, name.length - 4);
      }
    }
  }
  return name;
};
