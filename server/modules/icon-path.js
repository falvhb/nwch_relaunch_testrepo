module.exports = function getIconPath(skin) {
  if (skin.match(/^(bzb|blz)$/)) {
    return iconPath = 'bz';
  } else if (skin.match(/^(ot)$/)) {
    return iconPath = 'ot';
  }

  return 'az';
};
