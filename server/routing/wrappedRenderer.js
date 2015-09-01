/* eslint-disable no-console */

module.exports = function wrappedRenderer(res, renderer) {
  /** Wraps an acync renderer
   *
   * This makes sure an exception is not blocking a request.
   *
   * Usage with async api::
   *   function render() {
   *     throw new Error('An error');
   *   }
   *   req.api.done(wrappedRenderer(res, renderer));
   */
  function ready() {
    try {
      renderer();
    } catch (e) {
      // make the exception visible in the console log
      console.trace(e);
      // render an HTML comment as a placeholder
      res.send('<!-- Exception "' + e + '" -->');
    }
  }
  // return the wrapped callback
  return ready;
};
