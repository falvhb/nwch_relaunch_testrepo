var assert = require('chai').assert;
var normalize = require('../../app/node_modules/helpers/article/get-url').normalize;

describe('normalize', function() {

  it('normalize test various strings', function() {
    var url = "   Bär in Ößterreich frißt Äpfel, Übermüdete   -   _österhasen.:>><";
    assert.equal(normalize(url), "baer-in-oeszterreich-friszt-aepfel-uebermuedete-oesterhasen");
  });
  it('normalize test various strings', function() {
    var url = "HoschiGaloschi";
    assert.equal(normalize(url), "hoschigaloschi");
  });
  it('normalize test various strings', function() {
    var url = "Hoschi Galoschi";
    assert.equal(normalize(url), "hoschi-galoschi");
  });
  it('normalize test various strings', function() {
    var url = " Hoschi   Galoschi   ";
    assert.equal(normalize(url), "hoschi-galoschi");
  });
  it('normalize test various strings', function() {
    var url = " ä ö ü  Ä Ö Ü ß";
    assert.equal(normalize(url), "ae-oe-ue-ae-oe-ue-sz");
  });

});
