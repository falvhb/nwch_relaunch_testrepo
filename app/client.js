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
var HeaderNav = require('components/header-nav');
var RessortHeader = require('components/ressort-header');
var DossierHeader = require('components/dossier-header');

Advertising.init('.ad');
Advertising.stickAd({
  element: '.ad--skyscraper',
  stopSticky: '#bottom_board',
  offset: 30,
  breakpoint: 1390
});

var components = {
  articleHeader: ArticleHeader,
  articleIntro: ArticleIntro,
  articleDetail: ArticleDetail,
  teaser: Teaser,
  relatedVideos: RelatedVideos,
  footer: Footer,
  topicDetail: TopicDetail,
  headerNav: HeaderNav,
  ressortHeader: RessortHeader,
  dossierHeader: DossierHeader
};

iso.hydrate(components);

var RecommendationsTop = require('clientside/recommendations-top');
var recommendationsTop = new RecommendationsTop();
recommendationsTop.init();


