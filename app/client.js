var Iso = require('iso-react');

var ArticleDetail = require('components/article-detail');
var ArticleIntro = require('components/article-intro');
var DossierHeader = require('components/dossier-header');
var Footer = require('components/footer');
var HeaderNav = require('components/header-nav');
var RelatedVideos = require('components/related-videos');
var Teaser = require('components/teaser');
var TopicDetail = require('components/topic-detail');

// Map ids to required components
var components = {
  articleDetail: ArticleDetail,
  articleIntro: ArticleIntro,
  dossierHeader: DossierHeader,
  footer: Footer,
  headerNav: HeaderNav,
  relatedVideos: RelatedVideos,
  teaser: Teaser,
  topicDetail: TopicDetail
};

// Hydrate all components client-side
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
var StickyNode = require('advertising/sticky-node');

Advertising.init('.ad');

var load = function() {
  StickyNode.init({
    element: '.ad--skyscraper',
    stopper: '#content_board',
    offset: 170,
    breakpoint: 1400
  });
};

window.addEventListener('load', load, false);
