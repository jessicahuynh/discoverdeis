(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var _groundUtil = Package['ground:util']._groundUtil;
var Ground = Package['ground:util'].Ground;
var ServerTime = Package['ground:servertime'].ServerTime;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var OneTimeout = Package['raix:onetimeout'].OneTimeout;
var MiniMax = Package['ground:minimax'].MiniMax;
var Store = Package['ground:store'].Store;

/* Package-scope variables */
var _groundDbConstructor, Ground, GroundDB;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/ground_db/groundDB.server.js                                            //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/* global _groundDbConstructor:true */                                              // 1
/*                                                                                  // 2
                                                                                    // 3
                                                                                    // 4
TODO:                                                                               // 5
  `Meteor.default_server` - `Meteor.server`                                         // 6
                                                                                    // 7
*/                                                                                  // 8
///////////////////////////////// TEST SCOPE ///////////////////////////////////    // 9
                                                                                    // 10
Meteor.server = Meteor.server || Meteor.default_server; // jshint ignore:line       // 11
                                                                                    // 12
//////////////////////////////// GROUND DATABASE ///////////////////////////////    // 13
                                                                                    // 14
_groundDbConstructor = function(collection, options) { // jshint ignore:line        // 15
  var self;                                                                         // 16
  // XXX: Write the grounddb constructor                                            // 17
                                                                                    // 18
                                                                                    // 19
  // // This is the basic interface allowing users easily access for handling       // 20
  // // method calls, this.super() is the super and this.collection is self         // 21
  // // TODO: Remove this section to the README                                     // 22
  // self.conflictHandlers = (options && options.conflictHandlers)?                 // 23
  //       options.conflictHandlers: {                                              // 24
  //   'insert': function(doc) {                                                    // 25
  //     //console.log('insert');                                                   // 26
  //     //console.log(doc);                                                        // 27
  //     this.super(doc);                                                           // 28
  //   },                                                                           // 29
  //   'update': function(id, modifier) {                                           // 30
  //     //console.log('update');                                                   // 31
  //     //console.log(id);                                                         // 32
  //     //console.log(modifier);                                                   // 33
  //     this.super(id, modifier);                                                  // 34
  //   },                                                                           // 35
  //   'remove': function(id) {                                                     // 36
  //     //console.log('remove');                                                   // 37
  //     //console.log(id);                                                         // 38
  //     this.super(id);                                                            // 39
  //   }                                                                            // 40
  // };                                                                             // 41
                                                                                    // 42
  // // Create overwrite interface                                                  // 43
  // _.each(['insert', 'update', 'remove'], function(name) {                        // 44
  //   // TODO: init default conflict handlers                                      // 45
  //   //self.conflictHandlers[name] = function() {                                 // 46
  //   //  this.super.apply(this, arguments);                                       // 47
  //   //};                                                                         // 48
                                                                                    // 49
  //   // Save super                                                                // 50
  //   var _super = Meteor.default_server.method_handlers['/'+self.name+'/'+name];  // 51
  //   // Overwrite                                                                 // 52
  //   Meteor.default_server.method_handlers['/'+self.name+'/'+name] = function() {
  //     var _this = this;                                                          // 54
  //     _this.collection = self;                                                   // 55
  //     _this.super = _super;                                                      // 56
  //     // Call the conflicthandlers                                               // 57
  //     self.conflictHandlers[name].apply(_this, arguments);                       // 58
  //   };                                                                           // 59
  // });                                                                            // 60
                                                                                    // 61
  return self;                                                                      // 62
};                                                                                  // 63
                                                                                    // 64
                                                                                    // 65
// Global helper for applying grounddb on a collection                              // 66
Ground.Collection = function(name, options) {                                       // 67
  var self;                                                                         // 68
  // Inheritance Meteor Collection can be set by options.collection                 // 69
  // Accepts smart collections by Arunoda Susiripala                                // 70
  // Check if user used the "new" keyword                                           // 71
                                                                                    // 72
                                                                                    // 73
  // Make sure we got some options                                                  // 74
  options = options || {};                                                          // 75
                                                                                    // 76
  // Either name is a Meteor collection or we create a new Meteor collection        // 77
  if (name instanceof _groundUtil.Collection) {                                     // 78
    self = name;                                                                    // 79
  } else {                                                                          // 80
    self = new _groundUtil.Collection(name, options);                               // 81
  }                                                                                 // 82
                                                                                    // 83
  // Throw an error if something went wrong                                         // 84
  if (!(self instanceof _groundUtil.Collection)) {                                  // 85
    throw new Error('Ground.Collection expected a Mongo.Collection');               // 86
  }                                                                                 // 87
                                                                                    // 88
  // Add grounddb to the collection, circular reference since self is               // 89
  // grounddb.collection                                                            // 90
  self.grounddb = new _groundDbConstructor(self, options);                          // 91
                                                                                    // 92
  // Return grounded collection - We dont return this eg if it was an instance      // 93
  // of Ground.Collection                                                           // 94
  return self;                                                                      // 95
};                                                                                  // 96
                                                                                    // 97
////////////////////////// TIMESTAMP CONFLICTHANDLER ///////////////////////////    // 98
                                                                                    // 99
// TODO:                                                                            // 100
// When clients make changes the server should track the documents from the         // 101
// clients to see if the changes are new or old changes.                            // 102
// This could be done in several ways.                                              // 103
// Either by versions or server timestamps - both could work.                       // 104
//                                                                                  // 105
// Conflicting overview:                                                            // 106
// We could cut it down to comparing two documents and keep / broadcast the         // 107
// winning document.                                                                // 108
//                                                                                  // 109
// conflictHandler = function(clientDoc, serverDoc) { return serverDoc; }           // 110
//                                                                                  // 111
//                                                                                  // 112
// There should be found a way of registrating deleted documents - eg. by having    // 113
// a flag set 'active' all nonactive documents should then be removed from          // 114
// published documents.                                                             // 115
//                                                                                  // 116
// This could be a standalone package since it would introduce conflict             // 117
// handling in generel                                                              // 118
//                                                                                  // 119
// Regz. RaiX                                                                       // 120
                                                                                    // 121
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:db'] = {
  Ground: Ground,
  GroundDB: GroundDB
};

})();

//# sourceMappingURL=ground_db.js.map
