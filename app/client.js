var Iso = require('iso-react');
var iso = new Iso();

var ArticleHeader = require('components/article-header');
var ArticleIntro = require('components/article-intro');
var ArticleDetail = require('components/article-detail');
var Teaser = require('components/teaser');

var components = {
  articleHeader: ArticleHeader,
  articleIntro: ArticleIntro,
  articleDetail: ArticleDetail,
  teaser: Teaser
};

iso.hydrate(components);

var RecommendationsTop = require('client/recommendations-top');
var recommendationsTop = new RecommendationsTop();
recommendationsTop.init();
