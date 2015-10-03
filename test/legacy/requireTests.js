var assert = require('chai').assert;

describe('require', function() {

  it('the require test: see if we can get all files to load ... sort order is alphabetical, per directory.', function() {
    require("../../app/node_modules/legacy/components/ArticleAnriss");
    require("../../app/node_modules/legacy/components/ArticleAnrissAsLink");
    require("../../app/node_modules/legacy/components/ArticleComments");
    require("../../app/node_modules/legacy/components/articleHeadline3Col");
    require("../../app/node_modules/legacy/components/articleHeadline6Col");
    require("../../app/node_modules/legacy/components/articleImage3Col");
    require("../../app/node_modules/legacy/components/articleImage6Col");
    require("../../app/node_modules/legacy/components/articleImage9Col");
    require("../../app/node_modules/legacy/components/ArticleKeyword3Col");
    require("../../app/node_modules/legacy/components/ArticleKeyword6Col");
    require("../../app/node_modules/legacy/components/articleLabel");
    require("../../app/node_modules/legacy/components/articleLabelTeaserNoDisplayAsset");
    require("../../app/node_modules/legacy/components/teaser3Col");
    require("../../app/node_modules/legacy/components/teaser6Col");
    require("../../app/node_modules/legacy/components/teaser6ColTiny");
    require("../../app/node_modules/legacy/components/teaser9Col");
    require("../../app/node_modules/legacy/components/teaserJustAnriss3Col");
    require("../../app/node_modules/legacy/components/teaserJustHeadline3Col");
    require("../../app/node_modules/legacy/components/teaserNoAnriss3Col");
    require("../../app/node_modules/legacy/components/teaserNoAnriss6Col");
    require("../../app/node_modules/legacy/components/teaserNoImage3Col");
    require("../../app/node_modules/legacy/components/teaserNoImage6Col");
    require("../../app/node_modules/legacy/components/teaserNoImage9Col");

    require("../../app/node_modules/legacy/helpers/assets");
    require("../../app/node_modules/legacy/helpers/getAbsoluteUrl");
    require("../../app/node_modules/legacy/helpers/nbsp");
    require("../../app/node_modules/legacy/helpers/registry");
    require("../../app/node_modules/legacy/helpers/relations");
    require("../../app/node_modules/legacy/helpers/textfmt");
    require("../../app/node_modules/legacy/helpers/views");
  });

});
