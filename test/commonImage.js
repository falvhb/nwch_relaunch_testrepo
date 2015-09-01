var assert = require('chai').assert;

var image = require('../common/image');

describe('Build image URL without fill', function() {
  assert.equal(image.createImageSrc('/base', 100, 200, false),
               '/base/3TObJDG9e_nX2KY9PTR12YBCBU0/100x200');
});

describe('Build image URL with fill', function() {
  assert.equal(image.createImageSrc('/base', 100, 200, true),
               '/base/ADSsDlctTTZjXQM_D46bbCmL1gY/100x200,fill');

});
