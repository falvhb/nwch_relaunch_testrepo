var Iso = require('iso-react');
var iso = new Iso();

var ArticleHeader = require('components/article-header');
var ArticleIntro = require('components/article-intro');
var ArticleDetail = require('components/article-detail');
var Teaser = require('components/teaser');
var RelatedVideos = require('components/related-videos');

var components = {
  articleHeader: ArticleHeader,
  articleIntro: ArticleIntro,
  articleDetail: ArticleDetail,
  teaser: Teaser,
  relatedVideos: RelatedVideos
};

iso.hydrate(components);

var RecommendationsTop = require('clientside/recommendations-top');
var recommendationsTop = new RecommendationsTop();
recommendationsTop.init();
