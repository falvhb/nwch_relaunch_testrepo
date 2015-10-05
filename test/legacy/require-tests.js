var assert = require('chai').assert;

describe('require', function() {

  it('the require test: see if we can get all files to load ... sort order is alphabetical, per directory.', function() {
    require('../../app/node_modules/legacy/components/article-anriss');
    require('../../app/node_modules/legacy/components/article-anriss-as-link');
    require('../../app/node_modules/legacy/components/article-comments');
    require('../../app/node_modules/legacy/components/article-headline-3col');
    require('../../app/node_modules/legacy/components/article-headline-6col');
    require('../../app/node_modules/legacy/components/article-image-3col');
    require('../../app/node_modules/legacy/components/article-image-6col');
    require('../../app/node_modules/legacy/components/article-image-9col');
    require('../../app/node_modules/legacy/components/article-keyword-3col');
    require('../../app/node_modules/legacy/components/article-keyword-6col');
    require('../../app/node_modules/legacy/components/article-label');
    require('../../app/node_modules/legacy/components/article-label-teaser-no-display-asset');
    require('../../app/node_modules/legacy/components/teaser3Col');
    require('../../app/node_modules/legacy/components/teaser6Col');
    require('../../app/node_modules/legacy/components/teaser6ColTiny');
    require('../../app/node_modules/legacy/components/teaser9Col');
    require('../../app/node_modules/legacy/components/teaserJustAnriss3Col');
    require('../../app/node_modules/legacy/components/teaserJustHeadline3Col');
    require('../../app/node_modules/legacy/components/teaserNoAnriss3Col');
    require('../../app/node_modules/legacy/components/teaserNoAnriss6Col');
    require('../../app/node_modules/legacy/components/teaserNoImage3Col');
    require('../../app/node_modules/legacy/components/teaserNoImage6Col');
    require('../../app/node_modules/legacy/components/teaserNoImage9Col');

    require('../../app/node_modules/legacy/helpers/assets');
    require('../../app/node_modules/legacy/helpers/get-absolute-url');
    require('../../app/node_modules/legacy/helpers/nbsp');
    require('../../app/node_modules/legacy/helpers/registry');
    require('../../app/node_modules/legacy/helpers/relations');
    require('../../app/node_modules/legacy/helpers/textfmt');
    require('../../app/node_modules/legacy/helpers/views');
  });

});
