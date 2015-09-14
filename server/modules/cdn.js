module.exports = function staticDomainCSSPath(domainUrl, domainName) {
  var path = domainUrl;
  if (!path.endsWith('/')) {
    path += '/';
  }
  return path + 'static/az/style/' + domainName;
};
