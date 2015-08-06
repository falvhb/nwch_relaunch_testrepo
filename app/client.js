var Iso = require('iso-react');
var iso = new Iso();

var ArticleHeader = require('components/article-header');
var ArticleIntro = require('components/article-intro');
var ArticleDetail = require('components/article-detail');
var Teaser = require('components/teaser');
var Advertising = require('advertising');
var RelatedVideos = require('components/related-videos');
var Footer = require('components/footer');
var TopicDetail = require('components/topic-detail');
var RessortHeader = require('components/ressort-header');

advertising = Advertising.init('.ad');


var components = {
  articleHeader: ArticleHeader,
  articleIntro: ArticleIntro,
  articleDetail: ArticleDetail,
  teaser: Teaser,
  relatedVideos: RelatedVideos,
  footer: Footer,
  topicDetail: TopicDetail,
  ressortHeader: RessortHeader
};

iso.hydrate(components);

var RecommendationsTop = require('clientside/recommendations-top');
var recommendationsTop = new RecommendationsTop();
recommendationsTop.init();
