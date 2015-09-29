// SETUP REQUIRED ENVIRONMENT VARIABLES
process.env.KALTURA_ACCOUNT_ID = 1289881;


// unit testing the View class using the registry class
var assert = require('chai').assert;

var View = require("../../app/node_modules/legacy/helpers/views.jsx");
var registry = require("../../app/node_modules/legacy/helpers/registry.jsx");
var assets = require("../../app/node_modules/legacy/helpers/assets.jsx");

// shortcuts for cleaner code ...
var registerContentType = registry.registerContentType;
var getImplementation = registry.getImplementation;
var getRelationFor = registry.getRelationFor;
var clearAll = registry.clearAll;

// providing real data for the unit tests
var articleImage = require("./data/100003483.asset_image.json").data;
var articleImageIsUgc = require("./data/100003483.asset_image.is_ugc.json").data;
var articleImageWithLabel = require("./data/100003483.asset_image.with_label.json").data;
var articleImageNoTagsInLead = require("./data/100003483.asset_image.no_tags_in_lead.json").data;
var articleImageWithTagsInLead = require("./data/100003483.asset_image.with_tags_in_lead.json").data;
var articleImageWithTagsInLeadReplaced = require("./data/100003483.asset_image.with_tags_in_lead_replaced.json").data;
var articleImageEmptyText = require("./data/100003483.asset_image.empty_text.json").data;
var articleImageNoText = require("./data/100003483.asset_image.no_text.json").data;
var articleImageEmptyLead = require("./data/100003483.asset_image.empty_lead.json").data;
var articleImageNoLead = require("./data/100003483.asset_image.no_lead.json").data;
var articleImageNoIdNoTitle = require("./data/100003483.asset_image.no_id_no_title.json").data;
var articleImageNoId = require("./data/100003483.asset_image.no_id.json").data;
var articleImageNoTitle = require("./data/100003483.asset_image.no_title.json").data;
var articleImageNoTitleKeyword = require("./data/100003483.asset_image.no_title_keyword.json").data;
var articleImageNoRessorts = require("./data/100003483.asset_image.no_ressorts.json").data;
var articleImageRessortsButEmpty = require("./data/100003483.asset_image.ressorts_but_empty.json").data;
var articleImageRessortsSingle = require("./data/100003483.asset_image.ressorts_single.json").data;
var articleImageRessortsMultiple = require("./data/100004974.asset_image.ressorts_multiple.json").data;
var articleImageCommentableTrue = require("./data/100003483.asset_image.commentable_true.json").data;
var articleImageCommentableFooBar = require("./data/100003483.asset_image.commentable_foobar.json").data;
var articleImageNoCommentableKeyword = require("./data/100003483.asset_image.no_commentable_keyword.json").data;
var articleImageCommentCount50 = require("./data/100003483.asset_image.comment_count_50.json").data;
var articleImageNoCommentCountKeyword = require("./data/100003483.asset_image.no_comment_count_keyword.json").data;
var articleImageRessortsMultipleFirstIsUgc = require("./data/100004974.asset_image.ressorts_multiple.first_is_ugc.json").data;
var articleImageRessortsMultipleFirstIsUgcClub = require("./data/100004974.asset_image.ressorts_multiple.first_is_ugc_club.json").data;
var articleImageRessortsMultipleSecondIsUgc = require("./data/100004974.asset_image.ressorts_multiple.second_is_ugc.json").data;
var articleImageRessortsMultipleSecondIsUgcClub = require("./data/100004974.asset_image.ressorts_multiple.second_is_ugc_club.json").data;
var articleImageNoKeywords = require("./data/100003483.asset_image.no_keywords.json").data;
var articleImageEmptyKeywords = require("./data/100003483.asset_image.empty_keywords.json").data;
var articleImageNoCities = require("./data/100003483.asset_image.no_cities.json").data;
var articleImageEmptyCities = require("./data/100003483.asset_image.empty_cities.json").data;
var articleImageNoContextLabelNoKeywordsNoCities = require("./data/100003483.asset_image.no_context_label_no_keywords_no_city.json").data;
var articleImageNoContextLabelNoKeywordsButCities = require("./data/100003483.asset_image.no_context_label_no_keywords_but_cities.json").data;
var articleImageNoContextLabelKeywordsCities = require("./data/100003483.asset_image.no_context_label_keywords_cities.json").data;
var articleImageContextLabelKeywordsNoCities = require("./data/100003483.asset_image.context_label_keywords_no_cities.json").data;
var articleImageNoContextLabelKeywordsEmptyCities = require("./data/100003483.asset_image.no_context_label_keywords_empty_cities.json").data;
var articleImageNoContextLabelEmptyKeywordsCities = require("./data/100003483.asset_image.no_context_label_empty_keywords_cities.json").data;
var articleImageCommentCount = require("./data/100003483.asset_image.comment_count.json").data;
var articleImageSubRessort = require("./data/100004203.asset_image.with_sub_ressort.json").data;
var articleImageGallery = require("./data/100004228.asset_image_gallery.json").data;
var articleVideo = require("./data/100003338.asset_video.json").data;
var articleVideoKaltura = require("./data/100003338.asset_video.with_kaltura_id_and_asset.json").data;
var articleVideoKalturaNoStillImage = require("./data/100003338.asset_video.with_kaltura_id_no_still_image.json").data;
var articleAudio = require("./data/100003343.asset_audio.json").data;
var articleHtmlSnippet = require("./data/100004968.asset_htmlsnippet.first_asset_has_teaser.json").data;
var articleHtmlSnippet2 = require("./data/100004968.asset_htmlsnippet.second_asset_has_htmlsnippet.json").data;
var articleSurvey = require("./data/100003420.asset_survey.json").data;
var articleSurveyWithTeaserInFirstAsset = require("./data/100004965.asset_survey.first_asset_has_teaser.json").data;
var articleQuiz = require("./data/100003395.asset_quiz.json").data;
var articleQuizReverse = require("./data/100003395.asset_quiz_reverse.js").data;
var articleQuizWithTeaserInFirstAsset = require("./data/100003395.asset_quiz.first_asset_has_teaser.json").data;

const UGC_RESSORT_NAME = 'leserbeitrag';
const UGC_CLUB_RESSORT_NAME = 'vereinsmeldung';

describe('view', function() {

  describe("mainTeaserAssetUrl", function() {

    it('create a view using an article with images, register and see if we get the right url', function() {
      var view = new View(articleImage);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach");
    });
    it('create a view using an article that holds an image gallery, register and see if we get the right url', function() {
      var view = new View(articleImageGallery);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/ksr4EHKxcS5GcNfq_dzPFI9wJsE/8a1b0111855f2e61cf4c5a16ec083f2ec54eaaf6/teaser-goldbach");
    });
    it('create a view using an article that holds a video, register and see if we get the right url - in this case, image_url is ignored', function() {
      var view = new View(articleVideo);
      assert.equal(view.mainTeaserAssetUrl, "");
    });
    it('create a view using an article that holds a video with kaltura id, register and see if we get the right url', function() {
      var view = new View(articleVideoKaltura);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/DLDA3ekP0zGXUia_8pVrTBXJoR0/e54b69a2e5fad7768d52635f913a96a6170c1803/teaser-goldbach");
    });

    it('create a view using an article that holds a video with kaltura id, register and see if we get the right url', function() {
      var view = new View(articleVideoKalturaNoStillImage);
      assert.equal(view.mainTeaserAssetUrl, "http://cdnbakmi.kaltura.com/p/1289881/sp/128988100/thumbnail/entry_id/1_7zywfjdn/width/220/height/130/type/3");
    });

    it('create a view using an article that holds an audio, register and see if we get the right url', function() {
      var view = new View(articleAudio);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/-SzJNQ13hp5tCyjly48A0TviwEc/e0c6937d09ea46397d6ff6190204a9efd3777065/teaser-goldbach");
    });
    it('create a view using an article that holds a htmlsnippet, register and see if we get the right url', function() {
      var view = new View(articleHtmlSnippet);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach");
    });
    it('create a view using an article that holds a htmlsnippet, register and see if we get the right url', function() {
      var view = new View(articleHtmlSnippet2);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach");
    });
    it('create a view using an article that holds a survey, register and see if we get the right url', function() {
      var view = new View(articleSurvey);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach");
    });
    it('create a view using an article that holds a survey with teaser image in first asset, register and see if we get the right url', function() {
      var view = new View(articleSurveyWithTeaserInFirstAsset);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/wsT6NKdgl44RImtZ6ElmQsAAXzk/c4446a583936497fc5aee84fac2da0147c7b6fec/teaser-goldbach");
    });
    it('create a view using an article that holds a quiz, register and see if we get the right url', function() {
      var view = new View(articleQuiz);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach");
    });
    it('create a view using an article that holds a quiz reverse, register and see if we get the right url', function() {
      var view = new View(articleQuizReverse);
      assert.equal(view.mainTeaserAssetUrl, undefined);
    });
    it('create a view using an article that holds a quiz with teaser image in first asset, register and see if we get the right url', function() {
      var view = new View(articleQuizWithTeaserInFirstAsset);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/KeHsAFJPLrOwbSGomSlTvsoD3lw/ab06e1860c98d5d47d915c447d3ae3f6a4074819/teaser-goldbach");
    });
  });

/*
  get mainAssetLabel() {
    const { article } = this;
    if (article.label) {
      return article.label;
    }
    if (this.isUgcArticle) {
      if (article.ressorts && article.ressorts.length > 0) {
        return article.ressorts[0].title;
      }
    }
    return ASSET_LABELS[this.mainAssetType];
  }
  */

  describe("mainAssetLabel", function(){
    it('get the article\'s label', function() {
      var view = new View(articleImage);
      assert.equal(view.mainAssetLabel, undefined);
    });
    it('get the article\'s label', function() {
      var view = new View(articleImageWithLabel);
      assert.equal(view.mainAssetLabel, "dummyLabel");
    });
  });

/*
  get mainAssetType() {
    let asset = this.mainAsset;

    if (!asset) {
      return "";
    } else if (asset.asset.content_type === "asset_image_gallery") {
      if (asset.asset.images.length <= 1) {
        return "";
      }
    }
    return asset.asset.content_type;
  }
  */

  describe("mainAssetType", function(){
    it('get the article\'s type', function() {
      var view = new View(articleImage);
      assert.equal(view.mainAssetType, "asset_image");
    });
    it('get the article\'s type', function() {
      var view = new View(articleImageGallery);
      assert.equal(view.mainAssetType, "asset_image_gallery");
    });
  });

/*
  get mainAsset() {
    return getMainAsset(this.article.assets);
  }
  */

  describe("mainAsset", function() {
    it('get the article\'s main asset of an image', function() {
      var view = new View(articleImage);
      assert.instanceOf(view.mainAsset, assets.Image);
    });
    it('get the article\'s main asset of an image gallery', function() {
      var view = new View(articleImageGallery);
      assert.instanceOf(view.mainAsset, assets.ImageGallery);
    });
    it('get the article\'s main asset of a quiz', function() {
      var view = new View(articleQuizReverse);
      assert.instanceOf(view.mainAsset, assets.Quiz);
    });
  });

/*
  get isUgcArticle() {
    return this.article.content_type === "ugcnewsarticle";
  }
  */

  describe("isUgcArticle", function(){
    it('a UGC article', function() {
      var view = new View(articleImageIsUgc);
      assert.isTrue(view.isUgcArticle);
    });
    it('returns false for a non-UGC article', function() {
      var view = new View(articleImage);
      assert.isFalse(view.isUgcArticle);
    });
  });

/*
  clearHtml(text) {
    return text.replace(/<[^>]+>/ig,'');
  }
  */

  describe("clearHtml", function(){
    it('text is the same afterwards, i.e. no tags were replaced', function() {
      var view = new View(articleImage);
      assert.equal(view.clearHtml(articleImageNoTagsInLead.lead), articleImageNoTagsInLead.lead);
    });
    it('text is the same afterwards, i.e. no tags were replaced', function() {
      var view = new View(articleImageNoTagsInLead);
      assert.equal(view.clearHtml(articleImageNoTagsInLead.lead), articleImageNoTagsInLead.lead);
    });
    it('text containing tags was changed into a text without tags', function() {
      var view = new View(articleImageWithTagsInLead);
      assert.equal(view.clearHtml(articleImageWithTagsInLead.lead), articleImageWithTagsInLeadReplaced.lead);
    });
  });

/*
  get text() {
    return this.article.text; // most likely not used, @jukart???
  }
  */

  describe("text", function() {
    it('article contains a non empty text string', function() {
      var view = new View(articleImage);
      assert.equal(view.text, articleImage.text);
    });
    it('article contains an empty text string', function() {
      var view = new View(articleImageEmptyText);
      assert.equal(view.text, articleImageEmptyText.text);
    });
    it('article contains no text string', function() {
      var view = new View(articleImageNoText);
      assert.equal(view.text, undefined);
    });
  });


  /*
  get anriss() {
    return this.article.lead; // anriss is now lead ...
  }
  */

  describe("anriss", function() {
    var articleWithAnriss = { lead: "newsarticle" };
    var articleWithEmptyAnriss = { lead: "" };
    var articleNoAnrissKeyword = { foo: "" };

    it('article contains a non empty anriss string', function() {
      var view = new View(articleImage);
      assert.equal(view.anriss, articleImage.lead);
    });

    it('article contains an empty anriss(=lead) string', function() {
      var view = new View(articleImageEmptyLead);
      assert.equal(view.anriss, articleImageEmptyLead.lead);
    });

    it('article contains no lead(was anriss) string', function() {
      var view = new View(articleImageNoLead);
      assert.equal(view.anriss, '');
    });
  });

/*
  getTeaserUrl(width, height, letterbox = true) {
    let mainTeaserAssetUrl = this.mainTeaserAssetUrl;
    if (mainTeaserAssetUrl) {
      return createImageSrc(mainTeaserAssetUrl, width, height, letterbox);
    }
    return "";
  }
  */

  describe("getTeaserUrl", function() {
    var width = 360;
    var height = 240;
    var letterboxF = false;
    var letterboxT = true;

    // real
    it('getTeaserUrl returns with the expected suffix(letterbox=false)', function() {
      var view = new View(articleImage, { width: width, height: height });
      assert.isTrue(view.getTeaserUrl(letterboxF).endsWith(width + 'x' + height))
    });
    // real
    it('getTeaserUrl returns with the expected suffix(letterbox=true)', function() {
      var view = new View(articleImage, { width: width, height: height });
      assert.isTrue(view.getTeaserUrl(letterboxT).endsWith(width + 'x' + height + ',fill'))
    });
  });

  /*
    getAbsoluteUrl(leadingSlash = true) {
    return formCanonicalUrlPath(this.article, leadingSlash);
  }
  */

  describe("getAbsoluteUrl", function(){
    it('article neither contains a title nor an id', function() {
      var view = new View(articleImageNoIdNoTitle);
      assert.equal(view.getAbsoluteUrl(), null);
    });
    it('article contains an id but no title', function() {
      var view = new View(articleImageNoId);
      assert.equal(view.getAbsoluteUrl(), null);
    });
    it('article contains a title but not an id', function() {
      var view = new View(articleImageNoTitle);
      assert.equal(view.getAbsoluteUrl(), null);
    });
    it('article returns expected url, main ressort only', function() {
      var view = new View(articleImage);
      assert.equal(view.getAbsoluteUrl(), "/sport/digitalausgabe-limmattaler-zeitung-100003483");
    });
    it('article returns expected url, main ressort AND sub ressort', function() {
      var view = new View(articleImageSubRessort);
      assert.equal(view.getAbsoluteUrl(), "/beitrag/leserbeitrag/bericht10-100004203");
    });
  });

  /*
  get title() {
    return this.article.title || "";
  }
  */

  describe("title", function(){
    it('article contains a non empty title', function() {
      var view = new View(articleImage);
      assert.equal(view.title, articleImage.title);
    });
    it('article contains an empty title', function() {
      var view = new View(articleImageNoTitle);
      assert.equal(view.title, "");
    });
    it('article contains no title key', function() {
      var view = new View(articleImageNoTitleKeyword);
      assert.equal(view.title, "");
    });
  });

  /*
   get ressort() {
    if (this.article.ressorts && this.article.ressorts.length > 0) {
      return this.article.ressorts[0];
    }
  }
  */

  describe("ressort", function(){
    it('an article with no ressorts', function() {
      var view = new View(articleImageNoRessorts);
      assert.isUndefined(view.ressort);
    });
    it('an article with an empty ressort list', function() {
      var view = new View(articleImageRessortsButEmpty);
      assert.isUndefined(view.ressort);
    });
    it('ressort for an article with a single ressort', function() {
      var view = new View(articleImageRessortsSingle);
      assert.deepEqual(view.ressort, articleImageRessortsSingle.ressorts[0]);
    });
    it('returns the first ressort for an article with multiple ressorts', function() {
      var view = new View(articleImageRessortsMultiple);
      assert.deepEqual(view.ressort, articleImageRessortsMultiple.ressorts[0]);
    });
  });

 /*
 get commentable() {
    return this.article.commentable;
  }
 */

  describe("commentable", function(){
    it('article contains no commentable key', function() {
      var view = new View(articleImageNoCommentableKeyword);
      assert.equal(view.commentable, undefined);
    });
    it('article is commentable', function() {
      var view = new View(articleImageCommentableTrue);
      assert.equal(view.commentable, true);
    });
    it('article is not commentable', function() {
      var view = new View(articleImage);
      assert.equal(view.commentable, false);
    });
    it('article holds a string', function() {
      var view = new View(articleImageCommentableFooBar);
      assert.equal(view.commentable, articleImageCommentableFooBar.commentable);
    });
  });

/*
  get commentCount() {
    let c = this.article.comment_count;
    if (c > 0) {
      return `Kommentare ${c}`;
    }
    return "Kommentare";
  }
  */

  describe("commentCount", function(){
    it('article contains comment_count: 0', function() {
      var view = new View(articleImage);
      assert.equal(view.commentCount, "Kommentare");
    });
    it('article contains comment_count: 50', function() {
      var view = new View(articleImageCommentCount50);
      assert.equal(view.commentCount, "Kommentare 50");
    });
    it('article contains no comment_count keyword', function() {
      var view = new View(articleImageNoCommentCountKeyword);
      assert.equal(view.commentCount, "Kommentare");
    });
  });

/*
const UGC_RESSORT_NAME = 'leserbeitrag';
const UGC_CLUB_RESSORT_NAME = 'vereinsmeldung';

  get mainAssetLabelImg() {
    let ressort = this.ressort;

    if (ressort) {
      if (ressort.urlpart.toLowerCase() === UGC_RESSORT_NAME) {
        return "assetLabelIcon labelIconReader";
      } else if (ressort.urlpart.toLowerCase() === UGC_CLUB_RESSORT_NAME) {
        return "assetLabelIcon labelIconClub";
      }
    }

    return false;
  }
*/

  describe("mainAssetLabelImg", function(){
    it('an article with UGC_RESSORT_NAME (aka leserbeitrag)', function() {
      var view = new View(articleImageSubRessort);
      assert.equal(view.mainAssetLabelImg, 'assetLabelIcon labelIconReader');
    });
    it('an article with UGC_CLUB_RESSORT_NAME (aka vereinsmeldung)', function() {
      var view = new View(articleImageGallery);
      assert.equal(view.mainAssetLabelImg, 'assetLabelIcon labelIconClub');
    });
    it('an article with no ressorts', function() {
      var view = new View(articleImageNoRessorts);
      assert.equal(view.mainAssetLabelImg, false);
    });
    it('an article with an empty ressort list', function() {
      var view = new View(articleImageRessortsButEmpty);
      assert.equal(view.mainAssetLabelImg, false);
    });
    it('an article when first ressort is a UGC_RESSORT_NAME (aka leserbeitrag)', function() {
      var view = new View(articleImageRessortsMultipleFirstIsUgc);
      assert.equal(view.mainAssetLabelImg, "assetLabelIcon labelIconReader");
    });
    it('an article when first ressort is a UGC_CLUB_RESSORT_NAME (aka vereinsmeldung)', function() {
      var view = new View(articleImageRessortsMultipleFirstIsUgcClub);
      assert.equal(view.mainAssetLabelImg, "assetLabelIcon labelIconClub");
    });
    it('an article when first ressort is not a UGC_RESSORT_NAME but is present in the list of ressorts', function() {
      var view = new View(articleImageRessortsMultipleSecondIsUgc);
      assert.equal(view.mainAssetLabelImg, false);
    });
    it('an article when first ressort is a UGC_CLUB_RESSORT_NAME but is present in the list of ressorts', function() {
      var view = new View(articleImageRessortsMultipleSecondIsUgcClub);
      assert.equal(view.mainAssetLabelImg, false);
    });
  });

/*
    get mainKeyword() {
    if (this.article.keywords && this.article.keywords.length > 0) {
      return this.article.keywords[0];
    }
    return "";
  }
  */

  describe("mainKeyword", function() {
    it('an article with keywords', function() {
      var view = new View(articleImage);
      assert.equal(view.mainKeyword, "Piraten");
    });
    it('an article without keyword keywords', function() {
      var view = new View(articleImageNoKeywords);
      assert.equal(view.mainKeyword, "");
    });
    it('an article without keywords', function() {
      var view = new View(articleImageEmptyKeywords);
      assert.equal(view.mainKeyword, "");
    });
  });

/*
  get articleCity() {
    if (this.article.cities && this.article.cities.length > 0) {
      return this.article.cities[0];
    }
    return null;
  }

  get city() {
    let city = this.articleCity;
    if (city) {
      return city.name;
    }
    return "";
  }
  */

  describe("city", function() {
    it('returns true for an article with city', function() {
      var view = new View(articleImage);
      assert.equal(view.city, "Wengi");
    });
    it('returns true for an article without cities', function() {
      var view = new View(articleImageEmptyCities);
      assert.equal(view.city, "");
    });
    it('returns true for an article without cities keyword', function() {
      var view = new View(articleImageNoCities);
      assert.equal(view.city, "");
    });
  });

/*
  get spitzmarke() {
    return this.article.spitzmarke ||
    this.mainKeyword ||
    this.city;
  }
*/

  describe("spitzmarke", function(){ // spitzmarke is now context_label ...
    it('returns true for an article with neither spitzmarke nor keyword nor city', function() {
      var view = new View(articleImageNoContextLabelNoKeywordsNoCities);
      assert.equal(view.spitzmarke, "");
    });
    it('returns true for an article with neither spitzmarke nor keyword but city', function() {
      var view = new View(articleImageNoContextLabelNoKeywordsButCities);
      assert.equal(view.spitzmarke, articleImageNoContextLabelNoKeywordsButCities.cities[0].name);
    });
    it('returns true for an article with no spitzmarke but keyword and city', function() {
      var view = new View(articleImageNoContextLabelKeywordsCities);
      assert.equal(view.spitzmarke, articleImageNoContextLabelKeywordsCities.keywords[0]);
    });
    it('returns true for an article with spitzmarke, empty keywords list and cities', function() {
      var view = new View(articleImageContextLabelKeywordsNoCities);
      assert.equal(view.spitzmarke, articleImageContextLabelKeywordsNoCities.context_label);
    });
    it('returns true for an article and no spitzmarke, keyword and no city', function() {
      var view = new View(articleImageNoContextLabelKeywordsEmptyCities);
      assert.equal(view.spitzmarke, articleImageNoContextLabelKeywordsEmptyCities.keywords[0]);
    });
    it('returns true for an article without spitzmarke, empty keyword and city', function() {
      var view = new View(articleImageNoContextLabelEmptyKeywordsCities);
      assert.equal(view.spitzmarke, articleImageNoContextLabelEmptyKeywordsCities.cities[0].name);
    });
  });

});
