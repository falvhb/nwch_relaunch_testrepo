var React = require('react');

var Iso = require('iso-react');
var iso = new Iso();

var ArticleDetail = require('components/article-detail');
var Teaser = require('components/teaser');

var components = {
  articleDetail: ArticleDetail,
  teaser: Teaser
};

iso.hydrate(components);
