var ArticleDetail = require('components/article-detail');
var ArticleIntro = require('components/article-intro');
var DossierHeader = require('components/dossier-header');
var Footer = require('components/footer');
var HeaderNav = require('components/header-nav');
var RelatedVideos = require('components/related-videos');
var Teaser = require('components/teaser');
var TeaserSwitchable = require('components/teaser-switchable');
var TopicDetail = require('components/topic-detail');
var LatestArticles = require('components/latest-articles');

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
  topicDetail: TopicDetail,
  latestArticles: LatestArticles
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
// clearEmptyCells.init({ selector: '.grid__item' });
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

var loadFunction = function() {
  StickyNode.init({
    element: '#side_ad',
    parent: '.ad--skyscraper',
    container: '#sticky-wrapper',
    offset: 170,
    breakpoint: 1400
  });
};

window.addEventListener('load', loadFunction, false);
