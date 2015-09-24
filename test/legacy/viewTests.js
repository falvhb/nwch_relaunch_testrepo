
var assert = require('chai').assert;

var View = require("../../app/node_modules/legacy/helpers/views.jsx");

var registry = require("../../app/node_modules/legacy/helpers/registry.jsx");
// shortcuts for cleaner code ...
var registerContentType = registry.registerContentType;
var getImplementation = registry.getImplementation;
var getRelationFor = registry.getRelationFor;
var clearAll = registry.clearAll;

// move to real data in the unit tests
var articleImage = require("./data/100003483.asset_image.json").data;
var articleImageCommentCount = require("./data/100003483.asset_image.comment_countjson").data;
var articleImageSubRessort = require("./data/100004203.asset_image.with_sub_ressort.json").data;
var articleImageGallery = require("./data/100004228.asset_image_gallery.json").data;
var articleVideo = require("./data/100003338.asset_video.json").data;
var articleAudio = require("./data/100003343.asset_audio.json").data;
var articleHtmlSnippet = require("./data/100003284.asset_htmlsnippet.json").data;
var articleSurvey = require("./data/100003420.asset_survey.json").data;
var articleQuiz = require("./data/100003395.asset_quiz.json").data;
var articleQuizReverse = require("./data/100003395.asset_quiz_reverse.js").data;

// console.log(articleImage);

const UGC_RESSORT_NAME = 'leserbeitrag';
const UGC_CLUB_RESSORT_NAME = 'vereinsmeldung';

describe('view', function() {



  describe("mainTeaserAssetUrl", function() {


    it('create a view using an article with images, register and see if we get the right url', function() {
      var view = new View(articleImage);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach?");
    });

    it('create a view using an article that holds an image gallery, register and see if we get the right url', function() {
      var view = new View(articleImageGallery);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/ksr4EHKxcS5GcNfq_dzPFI9wJsE/8a1b0111855f2e61cf4c5a16ec083f2ec54eaaf6/teaser-goldbach?");
    });

    it('create a view using an article that holds a video, register and see if we get the right url', function() {
      var view = new View(articleVideo);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/ZmqewiKl5tsjkdB5Dk2n5eqINK4/d207b098f86e9d8775262994190d13debc353442/teaser-goldbach?");
    });

    it('create a view using an article that holds an audio, register and see if we get the right url', function() {
      var view = new View(articleAudio);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/-SzJNQ13hp5tCyjly48A0TviwEc/e0c6937d09ea46397d6ff6190204a9efd3777065/teaser-goldbach?");
    });

    it('create a view using an article that holds a htmlsnippet, register and see if we get the right url', function() {
      var view = new View(articleHtmlSnippet);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/aK8xE96RK4BHPm4SguQPxit31gU/c2dbe9d44a97250cae4e3bf1d196688a54dcf5e3/teaser-goldbach?");
    });

    it('create a view using an article that holds a survey, register and see if we get the right url', function() {
      var view = new View(articleSurvey);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach?");
    });

    it('create a view using an article that holds a quiz, register and see if we get the right url', function() {
      var view = new View(articleQuiz);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach?");
    });

    it('create a view using an article that holds a quiz reverse, register and see if we get the right url', function() {
      var view = new View(articleQuizReverse);
      assert.equal(view.mainTeaserAssetUrl, "http://localhost.local:8185/__ip/REA1Fl3nSf3YtgKTbyYdImgXoy8/1b80b0c7066f63c2f1dcbc0c2bcbf692e5877480/teaser-goldbach?");
    });

  });

/*
  get isUgcArticle() {
    return this.article.content_type === "ugcnewsarticle";
  }
  */

  describe("isUgcArticle", function(){
    var ugcArticle = { content_type: "ugcnewsarticle"  }
    var article = { content_type: "newsarticle"  }

    it('returns true for a UGC article', function() {
      var view = new View(ugcArticle);
      assert.isTrue(view.isUgcArticle);
    });

    it('returns false for a non-UGC article', function() {
      var view = new View(article);
      assert.isFalse(view.isUgcArticle);
    });
  });

/*
  clearHtml(text) {
    return text.replace(/<[^>]+>/ig,'');
  }
  */

  describe("clearHtml", function(){
    var articleNoTagsInLead = { lead: "did you know that string<>integer?" }
    var articleWithTagsInLead = { lead: "<html>this is a text that contains <foobar>some</foobar> tags</html>, but not for long" }
    var articleNoTagsInLeadAfterwards = { lead: "this is a text that contains some tags, but not for long" }

    // real article
    it('returns true if text is the same afterwards, i.e. no tags were replaced', function() {
      var view = new View(articleImage);
      assert.equal(view.clearHtml(articleNoTagsInLead.lead), articleNoTagsInLead.lead);
    });

    it('returns true if text is the same afterwards, i.e. no tags were replaced', function() {
      var view = new View(articleNoTagsInLead);
      assert.equal(view.clearHtml(articleNoTagsInLead.lead), articleNoTagsInLead.lead);
    });

    it('returns true if the text containing tags was changed into a text without tags', function() {
      var view = new View(articleWithTagsInLead);
      assert.equal(view.clearHtml(articleWithTagsInLead.lead), articleNoTagsInLeadAfterwards.lead);
    });

  });


/*
  get text() {
    return this.article.text; // most likely not used, @jukart???
  }
  */

  describe("text", function() {
    var articleWithText = { text: "some text" }
    var articleWithEmptyText = { text: "" }
    var articleNoTextKeyword = { foo: "" }

    it('returns true if article contains a non empty text string', function() {
      var view = new View(articleWithText);
      assert.equal(view.text, articleWithText.text);
    });

    it('returns true if article contains an empty text string', function() {
      var view = new View(articleWithEmptyText);
      assert.equal(view.text, articleWithEmptyText.text);
    });

    it('returns true if article contains no text string', function() {
      var view = new View(articleNoTextKeyword);
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

    it('returns true if article contains a non empty anriss string', function() {
      var view = new View(articleWithAnriss);
      assert.equal(view.anriss, articleWithAnriss.lead);
    });

    it('returns true if article contains an empty anriss string', function() {
      var view = new View(articleWithEmptyAnriss);
      assert.equal(view.anriss, articleWithEmptyAnriss.lead);
    });

    it('returns true if article contains no lead(was anriss) string', function() {
      var view = new View(articleNoAnrissKeyword);
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

    it('returns true if getTeaserUrl returns with the expected suffix(letterbox=false)', function() {
      var view = new View(articleImage);
      var temp_url = view.getTeaserUrl(width, height, letterboxF);

      var occurrence = temp_url.match(new RegExp(width + 'x' + height + '$'));
      var match = occurrence && occurrence.length > 0 && occurrence[0];
      var expected = width + 'x' + height;

      assert.equal(match, expected);
    });

    it('returns true if getTeaserUrl returns with the expected suffix(letterbox=true)', function() {
      var view = new View(articleImage);
      var temp_url = view.getTeaserUrl(width, height, letterboxT);

      var occurrence = temp_url.match(new RegExp(width + 'x' + height + ',fill$'));
      var match = occurrence && occurrence.length > 0 && occurrence[0];
      var expected = width + 'x' + height + ',fill';

      assert.equal(match, expected);
    });

  });

  /*
    getAbsoluteUrl(leadingSlash = true) {
    return formCanonicalUrlPath(this.article, leadingSlash);
  }
  */

  describe("getAbsoluteUrl", function(){
    var articleEmpty = {  }
    var articleNoTitle = { id: "" }
    var articleNoId = { title: "" }

    //var articleNoAnrissKeyword = { foo: "" }

    it('returns true if article neither contains a title nor an id', function() {
      var view = new View(articleEmpty);
      assert.equal(view.getAbsoluteUrl(), null);
    });

    it('returns true if article contains an id but no title', function() {
      var view = new View(articleNoId);
      assert.equal(view.getAbsoluteUrl(), null);
    });

    it('returns true if article contains a title but not an id', function() {
      var view = new View(articleNoTitle);
      assert.equal(view.getAbsoluteUrl(), null);
    });

    // real article
    it('returns true if article returns expected url, main ressort only', function() {
      var view = new View(articleImage);
      assert.equal(view.getAbsoluteUrl(), "/sport/digitalausgabe-limmattaler-zeitung-100003483");
    });

    // real article
    it('returns true if article returns expected url, main ressort AND sub ressort', function() {
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
    var articleNoTitle = { foo: ""}
    var articleWithTitle = { title: "Alles wunderbar" }
    var articleWithEmptyTitle = { title: "" }

    it('returns true if article contains no title key', function() {
      var view = new View(articleNoTitle);
      assert.equal(view.title, "");
    });

    it('returns true if article contains a non empty title', function() {
      var view = new View(articleWithTitle);
      assert.equal(view.title, articleWithTitle.title);
    });

    it('returns true if article contains an empty title', function() {
      var view = new View(articleWithEmptyTitle);
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

    var articleNoRessorts = { content_type: "newsarticle"  }
    var articleWithRessortsButEmpty = { ressorts: []  }
    var articleWithRessortsSingle = { ressorts: [ { title: 'ressort1'} ]  }
    var articleWithRessortsMultiple = { ressorts: [ { title: 'ressort1'}, { foo: 'ressort2'} ]  }

    it('returns true for an article with no ressorts', function() {
      var view = new View(articleNoRessorts);
      assert.isUndefined(view.ressort);
    });

    it('returns true for an article with an empty ressort list', function() {
      var view = new View(articleWithRessortsButEmpty);
      assert.isUndefined(view.ressort);
    });

    it('returns the ressort for an article with a single ressort', function() {
      var view = new View(articleWithRessortsSingle);
      assert.deepEqual(view.ressort, articleWithRessortsSingle.ressorts[0]);
    });

    it('returns the first ressort for an article with multiple ressorts', function() {
      var view = new View(articleWithRessortsMultiple);
      assert.deepEqual(view.ressort, articleWithRessortsSingle.ressorts[0]);
    });

  });

 /*
 get commentable() {
    return this.article.commentable;
  }
 */

  describe("commentable", function(){
    var articleNoCommentable = { }
    var articleCommentableTrue = { commentable: true }
    var articleCommentableFalse = { commentable: false }
    var articleCommentableFoo = { commentable: "foo" }

    it('returns true if article contains no commentable key', function() {
      var view = new View(articleNoCommentable);
      assert.equal(view.commentable, undefined);
    });

    it('returns true if article is commentable', function() {
      var view = new View(articleCommentableTrue);
      assert.equal(view.commentable, true);
    });

    it('returns true if article is not commentable', function() {
      var view = new View(articleCommentableFalse);
      assert.equal(view.commentable, false);
    });

    it('returns true if article holds a string', function() {
      var view = new View(articleCommentableFoo);
      assert.equal(view.commentable, articleCommentableFoo.commentable);
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
    var articleNoCommentCount = { }

    // real
    /*
    it('returns true if article contains comment_count: 0', function() {
      var view = new View(articleImage);
      assert.equal(view.commentCount, "Kommentare");
    });

    it('returns true if article contains no comment_count keyword', function() {
      var view = new View(articleNoCommentCount);
      assert.equal(view.commentCount, "Kommentare");
    });
    */

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

    var articleNoRessorts = { content_type: "newsarticle"  }
    var articleWithRessortsButEmpty = { ressorts: []  }

    var articleWithRessortsAndFirstIsUgcRessortName = { ressorts: [
        { title: 'ressort1',
          urlpart: 'LeserBeitrag'
        }
      ]
    }
    var articleWithRessortsAndFirstIsUgcClubRessortName = { ressorts: [
        { title: 'ressort1',
          urlpart: 'Vereinsmeldung'
        }
      ]
    }
    var articleWithRessortsAndFirstIsNotUgcRessortName = { ressorts: [
        { title: 'ressort1', urlpart: 'other' },
        { foo: 'ressort2', urlpart: 'LeserBeitrag'}
      ]
    }
    var articleWithRessortsAndFirstIsNotUgcClubRessortName = { ressorts: [
        { title: 'ressort1', urlpart: 'other' },
        { foo: 'ressort2', urlpart: 'VereinsMeldung'}
      ]
    }

    // real
    it('returns true for an article with UGC_RESSORT_NAME (aka leserbeitrag)', function() {
      var view = new View(articleImageSubRessort);
      assert.equal(view.mainAssetLabelImg, 'assetLabelIcon labelIconReader');
    });

    // real
    it('returns true for an article with UGC_CLUB_RESSORT_NAME (aka vereinsmeldung)', function() {
      var view = new View(articleImageGallery);
      assert.equal(view.mainAssetLabelImg, 'assetLabelIcon labelIconClub');
    });

    it('returns true for an article with no ressorts', function() {
      var view = new View(articleNoRessorts);
      assert.equal(view.mainAssetLabelImg, false);
    });

    it('returns true for an article with an empty ressort list', function() {
      var view = new View(articleWithRessortsButEmpty);
      assert.equal(view.mainAssetLabelImg, false);
    });

    it('returns the strings for an article when first ressort is a UGC_RESSORT_NAME (aka leserbeitrag)', function() {
      var view = new View(articleWithRessortsAndFirstIsUgcRessortName);
      assert.equal(view.mainAssetLabelImg, "assetLabelIcon labelIconReader");
    });

    it('returns the strings for an article when first ressort is a UGC_CLUB_RESSORT_NAME (aka vereinsmeldung)', function() {
      var view = new View(articleWithRessortsAndFirstIsUgcClubRessortName);
      assert.equal(view.mainAssetLabelImg, "assetLabelIcon labelIconClub");
    });

    it('returns the strings for an article when first ressort is not a UGC_RESSORT_NAME but is present in the list of ressorts', function() {
      var view = new View(articleWithRessortsAndFirstIsNotUgcRessortName);
      assert.equal(view.mainAssetLabelImg, false);
    });

    it('returns the strings for an article when first ressort is a UGC_CLUB_RESSORT_NAME but is present in the list of ressorts', function() {
      var view = new View(articleWithRessortsAndFirstIsNotUgcClubRessortName);
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

  describe("city", function(){ // spitzmarke is now context_label ...
    var articleNoCitiesKeyword = {  }
    var articleNoCities = { cities: [] }
    // real
    it('returns true for an article with city', function() {
      var view = new View(articleImage);
      assert.equal(view.city, "Wengi");
    });

    it('returns true for an article without cities', function() {
      var view = new View(articleNoCities);
      assert.equal(view.city, "");
    });

    it('returns true for an article without cities keyword', function() {
      var view = new View(articleNoCitiesKeyword);
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

    var articleNoSpitzmarkeNoKeywordNoCity = { }

    var articleNoSpitzmarkeNoKeywordCity = { cities: [ { id: 1, name: "Wengi", zips: [ "3251" ]  } ] }
    var articleNoSpitzmarkeKeywordCity = { keywords: [ "foo", "bar" ], cities: [ { id: 1, name: "Wengi", zips: [ "3251" ]  } ] }
    var articleSpitzmarkeKeywordCity = { context_label: "foo bar", keywords: [ "foo", "bar" ], cities: [ { id: 1, name: "Wengi", zips: [ "3251" ]  } ] }
    var articleSpitzmarkeKeywordNoCity = articleImage;
    var articleNoSpitzmarkeKeywordEmptyCity = { keywords: [ "foo", "bar" ], cities: [ ] }
    var articleNoSpitzmarkeEmptyKeywordCity = { keywords: [ ], cities: [ { id: 1, name: "Wengi", zips: [ "3251" ]  } ] }

    // and more variations possible ...

    it('returns true for an article with neither spitzmarke nor keyword nor city', function() {
      var view = new View(articleNoSpitzmarkeNoKeywordNoCity);
      assert.equal(view.spitzmarke, "");
    });

    it('returns true for an article with neither spitzmarke nor keyword but city', function() {
      var view = new View(articleNoSpitzmarkeNoKeywordCity);
      assert.equal(view.spitzmarke, articleNoSpitzmarkeKeywordCity.cities[0].name);
    });

    it('returns true for an article with no spitzmarke but keyword and city', function() {
      var view = new View(articleNoSpitzmarkeKeywordCity);
      assert.equal(view.spitzmarke, articleNoSpitzmarkeKeywordCity.keywords[0]);
    });

    // real
    it('returns true for an article with spitzmarke, empty keywords list and cities', function() {
      var view = new View(articleSpitzmarkeKeywordNoCity);
      assert.equal(view.spitzmarke, articleSpitzmarkeKeywordNoCity.context_label);
    });

    it('returns true for an article and no spitzmarke, keyword and no city', function() {
      var view = new View(articleNoSpitzmarkeKeywordEmptyCity);
      assert.equal(view.spitzmarke, articleNoSpitzmarkeKeywordEmptyCity.keywords[0]);
    });

    it('returns true for an article with spitzmarke, empty keyword and city', function() {
      var view = new View(articleNoSpitzmarkeEmptyKeywordCity);
      assert.equal(view.spitzmarke, articleNoSpitzmarkeEmptyKeywordCity.cities[0].name);
    });

  });

});
