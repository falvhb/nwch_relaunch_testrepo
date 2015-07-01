var React = require('react');

var Iso = require('iso-react');
var iso = new Iso();

var ArticleContent = require('components/article-content');
var ArticleHeader = require('components/article-header');

var components = {
  articleContent: ArticleContent,
  articleHeader: ArticleHeader
}

iso.hydrate(components);
