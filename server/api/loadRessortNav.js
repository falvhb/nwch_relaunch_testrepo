module.exports = function(req) {
  var domain = req.headers['x-skin'] || 'aaz';
  var ressortName = req.params.ressort;
  if (req.params.subressort) {
    ressortName += ',' + req.params.subressort;
  }
  var apiConfig = {
    endpoint: '/content/news_ressorts/' + ressortName + '/subressorts?domain=' + domain,
    key: 'ressortnav'
  };
  req.api.retrieve(apiConfig);
};
