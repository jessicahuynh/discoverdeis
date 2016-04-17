(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Store;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/ground_store/storage.scope.js                            //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
// Define the Storage scope                                          // 1
Store = {};                                                          // 2
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:store'] = {
  Store: Store
};

})();

//# sourceMappingURL=ground_store.js.map
