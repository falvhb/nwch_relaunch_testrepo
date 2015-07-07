var React = require('react');

var Iso = require('iso-react');
var iso = new Iso();

var ArticleDetail = require('components/article-detail');
var ArticleHeader = require('components/article-header');
var Teaser = require('components/teaser');

var components = {
  articleDetail: ArticleDetail,
  articleHeader: ArticleHeader,
  teaser: Teaser
};

iso.hydrate(components);
