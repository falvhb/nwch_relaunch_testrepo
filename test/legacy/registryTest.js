// unit testing the relation and asset classes
var assert = require('chai').assert;

var registry = require("../../app/node_modules/legacy/helpers/registry.jsx");
// shortcuts for cleaner code ...
var registerContentType = registry.registerContentType;
var getImplementation = registry.getImplementation;
var getRelationFor = registry.getRelationFor;
var clearAll = registry.clearAll;
var printAll = registry.printAll;

var imageRelObj = require("./data/100003483.asset_image.json").data.assets[0];
var imageObj = require("./data/100003483.asset_image.json").data.assets[0].asset;
var imageGalleryRelObj = require("./data/100004228.asset_image_gallery.json").data.assets[0];
var imageGalleryObj = require("./data/100004228.asset_image_gallery.json").data.assets[0].asset;
var videoRelObj = require("./data/100003338.asset_video.json").data.assets[0];
var videoObj = require("./data/100003338.asset_video.json").data.assets[0].asset;
var audioRelObj = require("./data/100003343.asset_audio.json").data.assets[0];
var audioObj = require("./data/100003343.asset_audio.json").data.assets[0];
var htmlSnippetRelObj = require("./data/100003284.asset_htmlsnippet.json").data.assets[1];
var surveyRelObj = require("./data/100003420.asset_survey.json").data.assets[0];
var quizRelObj        = require("./data/100003395.asset_quiz.json").data.assets[1];
var quizRelObjReverse = require("./data/100003395.asset_quiz_reverse.js").data.assets[0];

describe('registry', function() {

  describe("getRelationFor", function(){

    beforeEach(function () {
      clearAll();
    });

    it('returns null for an unregistered content_type', function() {
      assert.isNull(getRelationFor(imageRelObj.asset, imageRelObj));
    });

    it('returns an object of the registered class, asset_image_relation', function() {
      var imageRelCls = function(imageRelObj) {
        this.imageRel = imageRelObj;
      }
      registerContentType(imageRelCls, 'asset_image_relation')
      assert.isTrue(getRelationFor(imageRelObj.asset, imageRelObj) instanceof imageRelCls);
    });

    it('returns an object of the registered class, asset_image_gallery_relation', function() {
      var imageGalleryRelCls = function(imageGalleryRelObj) {
        this.imageGalleryRel = imageGalleryRelObj;
      }
      registerContentType(imageGalleryRelCls, 'asset_image_gallery_relation')
      assert.isTrue(getRelationFor(imageGalleryRelObj.asset, imageGalleryRelObj) instanceof imageGalleryRelCls);
    });

    it('returns an object of the registered class, asset_video_relation', function() {
      var videoRelCls = function(videoRelObj) {
        this.videoRelObj = videoRelObj;
      }
      registerContentType(videoRelCls, 'asset_video_relation')
      assert.isTrue(getRelationFor(videoRelObj.asset, videoRelObj) instanceof videoRelCls);
    });

    it('returns an object of the registered class, asset_audio_relation', function() {
      var audioRelCls = function(audioRelObj) {
        this.audioRelObj = audioRelObj;
      }
      registerContentType(audioRelCls, 'asset_audio_relation')
      assert.isTrue(getRelationFor(audioRelObj.asset, audioRelObj) instanceof audioRelCls);
    });

/*
    it('returns an object of the registered class, asset_htmlsnippet_relation', function() {
      var htmlSnippetRelCls = function(htmlSnippetRelObj) {
        this.htmlSnippetRelObj = htmlSnippetRelObj;
      }
      registerContentType(htmlSnippetRelCls, 'asset_htmlsnippet_relation')
      console.log("getRelationFor(htmlSnippetRelObj.asset)=", getRelationFor(htmlSnippetRelObj.asset));
      assert.isTrue(getRelationFor(htmlSnippetRelObj.asset, htmlSnippetRelObj) instanceof htmlSnippetRelCls);
    });
    */

    it('returns an object of the registered class, asset_survey_relation', function() {
      var surveyRelCls = function(surveyRelObj) {
        this.surveyRelObj = surveyRelObj;
      }
      registerContentType(surveyRelCls, 'asset_survey_relation')
      assert.isTrue(getRelationFor(surveyRelObj.asset, surveyRelObj) instanceof surveyRelCls);
    });

    it('returns an object of the registered class, asset_quiz_relation', function() {
      var quizRelCls = function(quizRelObj) {
        this.quizRelObj = quizRelObj;
      }
      registerContentType(quizRelCls, 'asset_quiz_relation')
      assert.isTrue(getRelationFor(quizRelObj.asset, quizRelObj) instanceof quizRelCls);
    });

    it('returns an object of the registered class, asset_quiz_relation', function() {
      var quizRelCls = function(quizRelObjReverse) {
        this.quizRelObj = quizRelObjReverse;
      }
      registerContentType(quizRelCls, 'asset_quiz_relation')
      assert.isTrue(getRelationFor(quizRelObjReverse.asset, quizRelObjReverse) instanceof quizRelCls);
    });

  });

  describe("getImplementation", function(){

    beforeEach(function () {
      clearAll();
    });

    it('returns null for an unregistered content_type', function() {
      assert.isNull(getImplementation(imageRelObj.asset));
    });

    it('returns an object of the registered class for an Image', function() {
      var imgCls = function(imageObj) {
        this.image = imageObj;
      }
      registerContentType(imgCls, 'asset_image')
      assert.isTrue(getImplementation(imageObj) instanceof imgCls);
    });

    it('returns an object of the registered class for an imageGallery', function() {
      var imgGalleryCls = function(imageGalleryObj) {
        this.image = imageGalleryObj;
      }
      registerContentType(imgGalleryCls, 'asset_image_gallery')
      assert.isTrue(getImplementation(imageGalleryObj) instanceof imgGalleryCls);
    });

    it('returns an object of the registered class and null for an unregistered class', function() {
      var imgCls = function(imageObj) {
        this.image = imageObj;
      }
      registerContentType(imgCls, 'asset_image');
      assert.isTrue(getImplementation(imageObj) instanceof imgCls);
      assert.isNull(getImplementation(videoObj));
    });

    it('returns an object depending on the content_type of the registered class', function() {
      var imgCls = function(imageObj) {
        this.image = imageObj;
      }
      var vidCls = function(videoObj) {
        this.video = videoObj;
      }
      registerContentType(imgCls, 'asset_image');
      registerContentType(vidCls, 'asset_video');
      assert.isTrue(getImplementation(imageObj) instanceof imgCls);
      assert.isTrue(getImplementation(videoObj) instanceof vidCls);
    });
  });

});
