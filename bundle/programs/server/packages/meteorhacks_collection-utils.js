(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/meteorhacks_collection-utils/packages/meteorhacks_collection-utils.js   //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
(function () {                                                                      // 1
                                                                                    // 2
////////////////////////////////////////////////////////////////////////////////    // 3
//                                                                            //    // 4
// packages/meteorhacks:collection-utils/index.js                             //    // 5
//                                                                            //    // 6
////////////////////////////////////////////////////////////////////////////////    // 7
                                                                              //    // 8
var Future = Npm.require('fibers/future');                                    // 1  // 9
                                                                              // 2  // 10
var originalOpen = MongoInternals.RemoteCollectionDriver.prototype.open;      // 3  // 11
MongoInternals.RemoteCollectionDriver.prototype.open = function(name) {       // 4  // 12
  var self = this;                                                            // 5  // 13
  var ret = originalOpen.call(this, name);                                    // 6  // 14
  ret._getDb = wrapWithDb(this.mongo);                                        // 7  // 15
                                                                              // 8  // 16
  return ret;                                                                 // 9  // 17
};                                                                            // 10
                                                                              // 11
Mongo.Collection.prototype._getDb = function() {                              // 12
  if(typeof this._collection._getDb == 'function') {                          // 13
    return this._collection._getDb();                                         // 14
  } else {                                                                    // 15
    // if we can't find `_getDb()`, that means this is                        // 16
    // a collection created before initializing this collection               // 17
    // if so, use the default mongo connection                                // 18
    //    eg:- Meteor.users                                                   // 19
    var mongoConn = MongoInternals.defaultRemoteCollectionDriver().mongo;     // 20
    return wrapWithDb(mongoConn);                                             // 21
  }                                                                           // 22
};                                                                            // 23
                                                                              // 24
Mongo.Collection.prototype._getCollection = function() {                      // 25
  var db = this._getDb();                                                     // 26
  return db.collection(this._name);                                           // 27
}                                                                             // 28
                                                                              // 29
function wrapWithDb(mongoConn) {                                              // 30
  // With Meteor 1.0.4, db creation is synchronous and wait in the connection // 31
  // constructor. So, we can get it like this.                                // 32
  if(mongoConn.db) {                                                          // 33
    return mongoConn.db;                                                      // 34
  }                                                                           // 35
                                                                              // 36
  // This is for Meteor versions older than 1.0.4                             // 37
  var f = new Future();                                                       // 38
  mongoConn._withDb(function(db) {                                            // 39
    f.return(db);                                                             // 40
  });                                                                         // 41
  return f.wait();                                                            // 42
}                                                                             // 43
////////////////////////////////////////////////////////////////////////////////    // 52
                                                                                    // 53
}).call(this);                                                                      // 54
                                                                                    // 55
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:collection-utils'] = {};

})();

//# sourceMappingURL=meteorhacks_collection-utils.js.map
