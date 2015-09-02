module.exports = function ressortPath(req) {
  /**
   * Returns the following if the respective values are set on 'req':
   *  '<ressort>'
   *  '<ressort>/<subressort>'
   *  or null
   */
  var ressort = req.params.ressort;
  var subressort = req.params.subressort;
  var result = null;
  if (ressort) {
    result = ressort;
    if (subressort) {
      result += '/' + subressort;
    }
  }
  return result;
}
