var React = require('react');

var Iso = require('iso-react');
var iso = new Iso();

var ArticleContent = require('components/article-content');

var components = {
  articleContent: ArticleContent
}

iso.hydrate(components);
