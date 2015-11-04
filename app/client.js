var ArticleDetail = require('components/article-detail');
var ArticleIntro = require('components/article-intro');
var DossierHeader = require('components/dossier-header');
var Footer = require('components/footer');
var HeaderNav = require('components/header-nav');
var RelatedVideos = require('components/related-videos');
var Teaser = require('components/teaser');
var TeaserSwitchable = require('components/teaser-switchable');
var Cover = require('components/cover');
var TopicDetail = require('components/topic-detail');
var LatestArticles = require('components/latest-articles');
var VideoLibrary = require('components/video-library');

// Map IDs to required components
var components = {
  articleDetail: ArticleDetail,
  articleIntro: ArticleIntro,
  dossierHeader: DossierHeader,
  footer: Footer,
  headerNav: HeaderNav,
  relatedVideos: RelatedVideos,
  teaser: Teaser,
  teaserSwitchable: TeaserSwitchable,
  cover: Cover,
  topicDetail: TopicDetail,
  latestArticles: LatestArticles,
  videoLibrary: VideoLibrary
};

// Hydrate all components client-side
var Iso = require('iso-react');
var iso = new Iso();
iso.hydrate(components);

// Top recommendations
var RecommendationsTop = require('clientside/recommendations-top');
var recommendationsTop = new RecommendationsTop();
recommendationsTop.init();

// Clean CMS empty grid cells
var ClearEmptyCells = require('clientside/clear-empty-cells');
var clearEmptyCells = new ClearEmptyCells();
clearEmptyCells.init({ selector: '.grid__item' });
clearEmptyCells.init({ selector: '.recommendations-top__cell' });
clearEmptyCells.init({ selector: '.recommendations-bottom__cell' });

// Advertising
var Advertising = require('advertising');

Advertising.injectAd({
  id: 'rectangle',
  content: '.article-body .copy',
  beforeParagraph: 2
});

Advertising.init('.ad');

// Ad Stickiness
var StickyNode = require('advertising/sticky-node');

var stickyNode = new StickyNode({
  parent: '.ad--skyscraper',
  element: '#side_ad',
  container: '#sticky-wrapper',
  height: 600,
  offset: 170,
  breakpoint: 1400,
});

window.StickyNode = stickyNode;

stickyNode.repositionVertically();

var loadFunction = function() {
  stickyNode.init();
};

window.addEventListener('load', loadFunction, false);
