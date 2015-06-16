module.exports = function (model, functionName) {
  /*
   * This common api utility adds generic functions to the given model in a
   * controlled fashion.
   *
   * @param model:
   *    The Model which is being extended by the functions defined below.
   * @param functionName:
   *    Optional. Is expected to be one of the function names defined for a 
   *    REST end point in 'datasources'.
   *    If not defined, a conventional function name is used e.g.:
   *        model = Users
   *        functionName = get_Users
   */
  var name = model.sharedClass.name;
  var funcName = functionName || 'get_' + name;

  model.get = function () {
    model[funcName].apply(null, arguments);
  };
};
