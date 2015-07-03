require('../setup');

var React = require('react');
var expect = require('chai').expect;

var ArticleContent = require('../../app/node_modules/components/article-content');

describe('ArticleContent', function() {
  var component = null;
  var componentString = null;
  
  beforeEach(function() {
    component = React.createElement(ArticleContent, {
      lead: "lead",
      keywords: [],
      text: "text",
      stoerer: [],
      assets: []
    }, {});
    componentString = React.renderToString(component);
  });
  
  it('contains the article\'s text', function() {
    expect(componentString).to.contain('text');
  });
  
  it('contains a description property', function() {
    expect(componentString).to.contain('itemprop="description"');
  });
  
  it('contains an articleBody property', function() {
    expect(componentString).to.contain('itemprop="articleBody"');
  });
});
