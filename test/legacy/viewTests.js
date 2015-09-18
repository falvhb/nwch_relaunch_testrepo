var assert = require('chai').assert;

var View = require("../../app/node_modules/legacy/helpers/views.jsx");

const UGC_RESSORT_NAME = 'leserbeitrag';
const UGC_CLUB_RESSORT_NAME = 'vereinsmeldung';

describe('view', function() {


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
  get anriss() {
    return this.article.lead; // anriss is now lead ...
  }
  */

  describe("anriss", function(){
    var articleWithAnriss = { lead: "newsarticle" }
    var articleWithEmptyAnriss = { lead: "" }
    var articleNoAnrissKeyword = { foo: "" }

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
      assert.equal(view.anriss, "");
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


