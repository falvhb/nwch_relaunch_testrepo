module.exports = function(RESTModel) {

  RESTModel.get = function() {
    /*
     * Generic implementation of the 'get' function.
     * It is expected that datasources.json contains a function to the
     * respective model.
     *
     * E.g.
     *   Model: Users
     *   datasources.json: Must contain an endpoint with a function 'getUsers'.
     */
    var name = this.sharedClass.name;
    this['get' + name].apply(null, arguments);
  };

};
