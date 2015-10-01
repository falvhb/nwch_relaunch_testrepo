var assert = require('chai').assert;
var cut = require("../../app/node_modules/legacy/helpers/textfmt.jsx").cut;

// {cut(view.spitzmarke, { cutLen: 30, softcut: true, fill: '...' } )}
// ${view.cut(view.text, { cutLen: 150, softcut: true, fill: '...mehr' } )}
// ${view.cut(view.text, { cutLen: 300, softcut: true, fill: '...mehr' } )}

describe('cut', function() {

  it('cut: spitzmarke to be shorter than 30 chars, expected to be returned as is', function() {
    var stringTest = "spitzmarke, kürzer 30 Zeichen";
    assert.equal(cut(stringTest, { cutLen: 30, softcut: true, fill: '...'}), "spitzmarke, kürzer 30 Zeichen");
  });
  it('cut: spitzmarke to be shorter than 30 chars, expected to be returned as is, softcut and fill irrelevant', function() {
    var stringTest = "spitzmarke, kürzer 30 Zeichen";
    assert.equal(cut(stringTest, { cutLen: 30, softcut: false, fill: '...'}), "spitzmarke, kürzer 30 Zeichen");
  });
  it('cut: spitzmarke to be longer than 30 chars, expected to be appended with \'...\'', function() {
    var stringTest = "dies ist eine spitzmarke, ein bisschen länger als 30 Zeichen";
    assert.equal(cut(stringTest, { cutLen: 30, softcut: true, fill: '...'}), "dies ist eine spitzmarke, ein...");
  });
  it('cut: spitzmarke to be longer than 30 chars, expected to be appended with \'...\'', function() {
    var stringTest = "dies ist eine spitzmarke, abgeschnittenmittenimwortohnesoftcut";
    assert.equal(cut(stringTest, { cutLen: 30, softcut: false, fill: '...'}), "dies ist eine spitzmarke, abge...");
  });

});
