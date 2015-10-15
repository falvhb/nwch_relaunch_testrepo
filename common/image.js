var responsiveImage = require('../app/node_modules/mixins/responsive-image');

module.exports = {

  createImageSrc: function(src, width, height, letterbox) {
    var params = {src: src,
                  width: width,
                  height: height,
                  letterbox: letterbox
                 };
    return responsiveImage.createImageSrc(params);
  }

};
