var Iso = require('iso-react');

var ArticleDetail = require('components/article-detail');
var ArticleHeader = require('components/article-header');
var ArticleIntro = require('components/article-intro');
var DossierHeader = require('components/dossier-header');
var Footer = require('components/footer');
var HeaderNav = require('components/header-nav');
var RelatedVideos = require('components/related-videos');
var RessortHeader = require('components/ressort-header');
var Teaser = require('components/teaser');
var TopicDetail = require('components/topic-detail');

// Map ids to required components
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
    breakpoint: 1390
  });
};

window.addEventListener('load', load, false);
