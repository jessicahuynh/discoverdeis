(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var wrapAsync;

(function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/meteorhacks_aggregate/packages/meteorhacks_aggregate.js         //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
(function () {                                                              // 1
                                                                            // 2
////////////////////////////////////////////////////////////////////////    // 3
//                                                                    //    // 4
// packages/meteorhacks:aggregate/index.js                            //    // 5
//                                                                    //    // 6
////////////////////////////////////////////////////////////////////////    // 7
                                                                      //    // 8
wrapAsync = (Meteor.wrapAsync)? Meteor.wrapAsync : Meteor._wrapAsync; // 1  // 9
Mongo.Collection.prototype.aggregate = function(pipelines, options) { // 2  // 10
  var coll;                                                           // 3  // 11
  if (this.rawCollection) {                                           // 4  // 12
    // >= Meteor 1.0.4                                                // 5  // 13
    coll = this.rawCollection();                                      // 6  // 14
  } else {                                                            // 7  // 15
	// < Meteor 1.0.4                                                    // 8  // 16
    coll = this._getCollection();                                     // 9  // 17
  }                                                                   // 10
  return wrapAsync(coll.aggregate.bind(coll))(pipelines, options);    // 11
}                                                                     // 12
                                                                      // 13
////////////////////////////////////////////////////////////////////////    // 22
                                                                            // 23
}).call(this);                                                              // 24
                                                                            // 25
//////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:aggregate'] = {};

})();

//# sourceMappingURL=meteorhacks_aggregate.js.map
