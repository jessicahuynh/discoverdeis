(function () {

/* Imports */
var _ = Package.underscore._;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var Tracker = Package.deps.Tracker;
var Deps = Package.deps.Deps;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var EasySearch;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/matteodem_easy-search/lib/easy-search-common.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
EasySearch = (function () {                                                                                       // 1
  'use strict';                                                                                                   // 2
                                                                                                                  // 3
  var ESCounts,                                                                                                   // 4
    Searchers,                                                                                                    // 5
    indexes = {/** @see defaultOptions */},                                                                       // 6
    defaultOptions = {                                                                                            // 7
      'format' : 'mongo',                                                                                         // 8
      'skip' : 0,                                                                                                 // 9
      'limit' : 10,                                                                                               // 10
      'use' : 'minimongo',                                                                                        // 11
      'reactive' : true,                                                                                          // 12
      'useTextIndexes' : false,                                                                                   // 13
      'props' : {},                                                                                               // 14
      'permission'  : function () {                                                                               // 15
        return true;                                                                                              // 16
      },                                                                                                          // 17
      'transform' : function () {},                                                                               // 18
      'sort' : function () {                                                                                      // 19
        if (Searchers[this.use]) {                                                                                // 20
          return Searchers[this.use].defaultSort(this);                                                           // 21
        }                                                                                                         // 22
                                                                                                                  // 23
        return {};                                                                                                // 24
      },                                                                                                          // 25
      'reactiveSort' : function () {                                                                              // 26
        if ('minimongo' === this.use || 'mongo-db' === this.use) {                                                // 27
          return this.sort();                                                                                     // 28
        }                                                                                                         // 29
                                                                                                                  // 30
        return ['_sortedOrder'];                                                                                  // 31
      },                                                                                                          // 32
      'count' : function () {                                                                                     // 33
        var doc = ESCounts.findOne({ _id : this.name });                                                          // 34
                                                                                                                  // 35
        if (doc) {                                                                                                // 36
          return doc.count;                                                                                       // 37
        }                                                                                                         // 38
                                                                                                                  // 39
        return 0;                                                                                                 // 40
      },                                                                                                          // 41
      'changeResults' : function (results) {                                                                      // 42
        return results;                                                                                           // 43
      },                                                                                                          // 44
      /**                                                                                                         // 45
       * When using elastic-search it's the query object,                                                         // 46
       * while using with mongo-db it's the selector object.                                                      // 47
       *                                                                                                          // 48
       * @param {String} searchString                                                                             // 49
       * @param {Object} options                                                                                  // 50
       * @return {Object}                                                                                         // 51
       */                                                                                                         // 52
      'query' : function (searchString, options) {                                                                // 53
        return Searchers[this.use].defaultQuery(this, searchString);                                              // 54
      }                                                                                                           // 55
    };                                                                                                            // 56
                                                                                                                  // 57
  ESCounts = new Mongo.Collection('esCounts');                                                                    // 58
                                                                                                                  // 59
  /** Helper Functions */                                                                                         // 60
  function setUpPublication(name, opts) {                                                                         // 61
    Meteor.publish(name + '/easySearch', function (conf) {                                                        // 62
      var resultSet,                                                                                              // 63
        resultArray,                                                                                              // 64
        findOptions = {},                                                                                         // 65
        publishScope = this,                                                                                      // 66
        resultIds = [],                                                                                           // 67
        publishHandle;                                                                                            // 68
                                                                                                                  // 69
      check(conf, { value: Match.Optional(String), skip: Number, limit: Match.Optional(Number), props: Object });
                                                                                                                  // 71
      if(!(indexes[name].permission())) {                                                                         // 72
        throw new Meteor.Error('not-allowed', "You're not allowed to search this index!");                        // 73
      }                                                                                                           // 74
                                                                                                                  // 75
      indexes[name].skip = conf.skip;                                                                             // 76
      indexes[name].limit = conf.limit || indexes[name].limit;                                                    // 77
      indexes[name].props = _.extend(indexes[name].props, conf.props);                                            // 78
      indexes[name].publishScope = this;                                                                          // 79
                                                                                                                  // 80
      if (!conf.value) {                                                                                          // 81
        conf.value = '';                                                                                          // 82
      }                                                                                                           // 83
                                                                                                                  // 84
      resultSet = Searchers[opts.use].search(name, conf.value, indexes[name]);                                    // 85
                                                                                                                  // 86
      ESCounts.update({ _id: name }, { $set: { count: resultSet.total } }, { upsert: true });                     // 87
                                                                                                                  // 88
      if (!resultSet.results.length) return this.ready();                                                         // 89
                                                                                                                  // 90
      if (_.isObject(resultSet.results[0])) {                                                                     // 91
        resultIds = _.pluck(resultSet.results, '_id');                                                            // 92
      } else if (_.isString(resultSet.results[0])) {                                                              // 93
        resultIds = resultSet.results;                                                                            // 94
      }                                                                                                           // 95
                                                                                                                  // 96
      // properly observe the collection!                                                                         // 97
      if (opts.returnFields) {                                                                                    // 98
        findOptions.fields = EasySearch._transformToFieldSpecifiers(opts.returnFields);                           // 99
      }                                                                                                           // 100
                                                                                                                  // 101
      // TODO: this doesn't work properly, that's why resultIds are used for now                                  // 102
      // see http://stackoverflow.com/questions/3142260/order-of-responses-to-mongodb-in-query                    // 103
      resultArray = _.map(resultIds, function (id) {                                                              // 104
        return { _id: id };                                                                                       // 105
      });                                                                                                         // 106
                                                                                                                  // 107
      publishHandle = opts.collection                                                                             // 108
        .find({ $or: resultArray }, findOptions)                                                                  // 109
        .observe({                                                                                                // 110
          added: function (doc) {                                                                                 // 111
            doc._index = name;                                                                                    // 112
            doc._sortedOrder = resultIds.indexOf(doc._id);                                                        // 113
            publishScope.added('esSearchResults', doc._id, doc);                                                  // 114
          },                                                                                                      // 115
          changed: function (doc) {                                                                               // 116
            doc._sortedOrder = resultIds.indexOf(doc._id);                                                        // 117
            publishScope.changed('esSearchResults', doc._id, doc);                                                // 118
          },                                                                                                      // 119
          removed: function (doc) {                                                                               // 120
            publishScope.removed('esSearchResults', doc._id);                                                     // 121
          }                                                                                                       // 122
        }                                                                                                         // 123
      );                                                                                                          // 124
                                                                                                                  // 125
      publishScope.onStop(function () {                                                                           // 126
        publishHandle.stop();                                                                                     // 127
      });                                                                                                         // 128
                                                                                                                  // 129
      publishScope.ready();                                                                                       // 130
    });                                                                                                           // 131
                                                                                                                  // 132
    Meteor.publish(name + '/easySearchCount', function () {                                                       // 133
      return ESCounts.find({ '_id' : name });                                                                     // 134
    });                                                                                                           // 135
  }                                                                                                               // 136
                                                                                                                  // 137
  function extendTransformFunction(collection, originalTransform) {                                               // 138
    return function (doc) {                                                                                       // 139
      var transformedDoc = collection._transform(doc);                                                            // 140
      return _.isFunction(originalTransform) ? originalTransform(transformedDoc) : transformedDoc;                // 141
    };                                                                                                            // 142
  }                                                                                                               // 143
                                                                                                                  // 144
  if (Meteor.isClient) {                                                                                          // 145
    /**                                                                                                           // 146
     * find method to let users interact with search results.                                                     // 147
     *                                                                                                            // 148
     * @param {Object} selector                                                                                   // 149
     * @param {Object} options                                                                                    // 150
     * @returns {MongoCursor}                                                                                     // 151
     */                                                                                                           // 152
    defaultOptions.find = function (selector, options) {                                                          // 153
      selector = selector || {};                                                                                  // 154
      selector._index = this.name;                                                                                // 155
                                                                                                                  // 156
      if (this.collection._transform) {                                                                           // 157
        options.transform = extendTransformFunction(this.collection, options.transform);                          // 158
      }                                                                                                           // 159
                                                                                                                  // 160
      return ESSearchResults.find(selector, options);                                                             // 161
    };                                                                                                            // 162
                                                                                                                  // 163
    /**                                                                                                           // 164
     * findOne method to let users interact with search results.                                                  // 165
     *                                                                                                            // 166
     * @param {Object} selector                                                                                   // 167
     * @param {Object} options                                                                                    // 168
     * @returns {Document}                                                                                        // 169
     */                                                                                                           // 170
    defaultOptions.findOne = function (selector, options) {                                                       // 171
      if (_.isObject(selector) || !selector) {                                                                    // 172
        selector = selector || {};                                                                                // 173
        selector._index = this.name;                                                                              // 174
      }                                                                                                           // 175
                                                                                                                  // 176
      if (this.collection._transform) {                                                                           // 177
        options.transform = extendTransformFunction(this.collection, options.transform);                          // 178
      }                                                                                                           // 179
                                                                                                                  // 180
      return ESSearchResults.findOne(selector, options);                                                          // 181
    };                                                                                                            // 182
  }                                                                                                               // 183
                                                                                                                  // 184
                                                                                                                  // 185
  /**                                                                                                             // 186
   * Searchers contains all engines that can be used to search content, until now:                                // 187
   *                                                                                                              // 188
   * minimongo (client): Client side collection for reactive search                                               // 189
   * elastic-search (server): Elastic search server to search with (fast)                                         // 190
   * mongo-db (server): MongoDB on the server to search (more convenient)                                         // 191
   *                                                                                                              // 192
   */                                                                                                             // 193
  Searchers = {};                                                                                                 // 194
                                                                                                                  // 195
  return {                                                                                                        // 196
    /**                                                                                                           // 197
     * Placeholder config method.                                                                                 // 198
     *                                                                                                            // 199
     * @param {Object} newConfig                                                                                  // 200
     */                                                                                                           // 201
    'config' : function (newConfig) {                                                                             // 202
      return {};                                                                                                  // 203
    },                                                                                                            // 204
    /**                                                                                                           // 205
     * Simple logging method.                                                                                     // 206
     *                                                                                                            // 207
     * @param {String} message                                                                                    // 208
     * @param {String} type                                                                                       // 209
     */                                                                                                           // 210
    'log' : function (message, type) {                                                                            // 211
      type = type || 'log';                                                                                       // 212
                                                                                                                  // 213
      if (console && _.isFunction(console[type])) {                                                               // 214
        return console[type](message);                                                                            // 215
      } else if (console && _.isFunction(console.log)) {                                                          // 216
        return console.log(message);                                                                              // 217
      }                                                                                                           // 218
    },                                                                                                            // 219
    /**                                                                                                           // 220
     * Create a search index.                                                                                     // 221
     *                                                                                                            // 222
     * @param {String} name                                                                                       // 223
     * @param {Object} options                                                                                    // 224
     */                                                                                                           // 225
    'createSearchIndex' : function (name, options) {                                                              // 226
      check(name, Match.OneOf(String, null));                                                                     // 227
      check(options, Object);                                                                                     // 228
                                                                                                                  // 229
      options.name = name;                                                                                        // 230
      options.field = _.isArray(options.field) ? options.field : [options.field];                                 // 231
      indexes[name] = _.extend(_.clone(defaultOptions), options);                                                 // 232
                                                                                                                  // 233
      options = indexes[name];                                                                                    // 234
                                                                                                                  // 235
      if (Meteor.isServer && EasySearch._usesSubscriptions(name)) {                                               // 236
        setUpPublication(name, indexes[name]);                                                                    // 237
      }                                                                                                           // 238
                                                                                                                  // 239
      Searchers[options.use] && Searchers[options.use].createSearchIndex(name, options);                          // 240
    },                                                                                                            // 241
    /**                                                                                                           // 242
     * Perform a search.                                                                                          // 243
     *                                                                                                            // 244
     * @param {String} name             the search index                                                          // 245
     * @param {String} searchString     the string to be searched                                                 // 246
     * @param {Object} options          defined with createSearchIndex                                            // 247
     * @param {Function} callback       optional callback to be used                                              // 248
     */                                                                                                           // 249
    'search' : function (name, searchString, options, callback) {                                                 // 250
      var results,                                                                                                // 251
        index = indexes[name],                                                                                    // 252
        searcherType = index.use;                                                                                 // 253
                                                                                                                  // 254
      check(name, String);                                                                                        // 255
      check(searchString, String);                                                                                // 256
      check(options, Object);                                                                                     // 257
      check(callback, Match.Optional(Function));                                                                  // 258
                                                                                                                  // 259
      if ("undefined" === typeof Searchers[searcherType]) {                                                       // 260
        throw new Meteor.Error(500, "Couldnt search with type: '" + searcherType + "'");                          // 261
      }                                                                                                           // 262
                                                                                                                  // 263
      if(!(indexes[name].permission())) {                                                                         // 264
        throw new Meteor.Error('not-allowed', "You're not allowed to search this index!");                        // 265
      }                                                                                                           // 266
                                                                                                                  // 267
      results = Searchers[searcherType].search(name, searchString, _.extend(indexes[name], options), callback);   // 268
                                                                                                                  // 269
      return index.changeResults(results);                                                                        // 270
    },                                                                                                            // 271
    /**                                                                                                           // 272
     * Retrieve a specific index configuration.                                                                   // 273
     *                                                                                                            // 274
     * @param {String} name                                                                                       // 275
     * @return {Object}                                                                                           // 276
     * @api public                                                                                                // 277
     */                                                                                                           // 278
    'getIndex' : function (name) {                                                                                // 279
      return indexes[name];                                                                                       // 280
    },                                                                                                            // 281
    /**                                                                                                           // 282
     * Retrieve all index configurations                                                                          // 283
     */                                                                                                           // 284
    'getIndexes' : function () {                                                                                  // 285
      return indexes;                                                                                             // 286
    },                                                                                                            // 287
    /**                                                                                                           // 288
     * Retrieve a specific Seacher.                                                                               // 289
     *                                                                                                            // 290
     * @param {String} name                                                                                       // 291
     * @return {Object}                                                                                           // 292
     * @api public                                                                                                // 293
     */                                                                                                           // 294
    'getSearcher' : function (name) {                                                                             // 295
      return Searchers[name];                                                                                     // 296
    },                                                                                                            // 297
    /**                                                                                                           // 298
     * Retrieve all Searchers.                                                                                    // 299
     */                                                                                                           // 300
    'getSearchers' : function () {                                                                                // 301
      return Searchers;                                                                                           // 302
    },                                                                                                            // 303
    /**                                                                                                           // 304
     * Loop through the indexes and provide the configuration.                                                    // 305
     *                                                                                                            // 306
     * @param {Array|String} indexes                                                                              // 307
     * @param callback                                                                                            // 308
     */                                                                                                           // 309
    'eachIndex' : function (indexes, callback) {                                                                  // 310
      indexes = !_.isArray(indexes) ? [indexes] : indexes;                                                        // 311
                                                                                                                  // 312
      _.each(indexes, function (index) {                                                                          // 313
        callback(index, EasySearch.getIndex(index));                                                              // 314
      });                                                                                                         // 315
    },                                                                                                            // 316
    /**                                                                                                           // 317
     * Makes it possible to override or extend the different                                                      // 318
     * types of search to use with EasySearch (the "use" property)                                                // 319
     * when using EasySearch.createSearchIndex()                                                                  // 320
     *                                                                                                            // 321
     * @param {String} key      Type, e.g. mongo-db, elastic-search                                               // 322
     * @param {Object} methods  Methods to be used, only 2 are required:                                          // 323
     *                          - createSearchIndex (name, options)                                               // 324
     *                          - search (name, searchString, [options, callback])                                // 325
     *                          - defaultQuery (options, searchString)                                            // 326
     *                          - defaultSort (options)                                                           // 327
     */                                                                                                           // 328
    'createSearcher' : function (key, methods) {                                                                  // 329
      check(key, String);                                                                                         // 330
      check(methods.search, Function);                                                                            // 331
      check(methods.createSearchIndex, Function);                                                                 // 332
                                                                                                                  // 333
      Searchers[key] = methods;                                                                                   // 334
    },                                                                                                            // 335
    /**                                                                                                           // 336
     * Helper to check if searcher uses server side subscriptions for searching.                                  // 337
     *                                                                                                            // 338
     * @param {String} index Index name to check configuration for                                                // 339
     */                                                                                                           // 340
    '_usesSubscriptions' : function (index) {                                                                     // 341
      var conf = EasySearch.getIndex(index);                                                                      // 342
      return conf && conf.reactive && conf.use !== 'minimongo';                                                   // 343
    },                                                                                                            // 344
    /**                                                                                                           // 345
     * Helper to transform an array of fields to Meteor "Field Specifiers"                                        // 346
     *                                                                                                            // 347
     * @param {Array} fields Array of fields                                                                      // 348
     */                                                                                                           // 349
    '_transformToFieldSpecifiers' : function (fields) {                                                           // 350
      var specifiers = {};                                                                                        // 351
                                                                                                                  // 352
      _.each(fields, function (field) {                                                                           // 353
        specifiers[field] = 1;                                                                                    // 354
      });                                                                                                         // 355
                                                                                                                  // 356
      return specifiers;                                                                                          // 357
    }                                                                                                             // 358
  };                                                                                                              // 359
})();                                                                                                             // 360
                                                                                                                  // 361
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/matteodem_easy-search/lib/easy-search-convenience.js                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Meteor.Collection.prototype.initEasySearch = function (fields, options) {                                         // 1
  if (!_.isObject(options)) {                                                                                     // 2
    options = {};                                                                                                 // 3
  }                                                                                                               // 4
                                                                                                                  // 5
  EasySearch.createSearchIndex(this._name, _.extend(options, {                                                    // 6
    'collection' : this,                                                                                          // 7
    'field' : fields                                                                                              // 8
  }));                                                                                                            // 9
};                                                                                                                // 10
                                                                                                                  // 11
if (Meteor.isClient) {                                                                                            // 12
  jQuery.fn.esAutosuggestData = function () {                                                                     // 13
    var input = $(this);                                                                                          // 14
                                                                                                                  // 15
    if (input.prop("tagName").toUpperCase() !== 'INPUT') {                                                        // 16
      return [];                                                                                                  // 17
    }                                                                                                             // 18
                                                                                                                  // 19
    return EasySearch.getComponentInstance({'id': input.parent().data('id'), 'index': input.parent().data('index')}).get('autosuggestSelected');
  }                                                                                                               // 21
}                                                                                                                 // 22
                                                                                                                  // 23
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/matteodem_easy-search/lib/searchers/mongo.js                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var methods = {                                                                                                   // 1
  /**                                                                                                             // 2
   * Set up a search index.                                                                                       // 3
   *                                                                                                              // 4
   * @param name                                                                                                  // 5
   * @param options                                                                                               // 6
   * @returns {void}                                                                                              // 7
   */                                                                                                             // 8
  'createSearchIndex' : function (name, options) {                                                                // 9
    if (Meteor.isServer && options.useTextIndexes) {                                                              // 10
      var indexDoc = EasySearch._transformFieldsToIndexDocument(options.field),                                   // 11
        rawCollection = EasySearch.getIndex(name).collection.rawCollection(),                                     // 12
        indexOptions = { name: name };                                                                            // 13
                                                                                                                  // 14
      if (options.weights) {                                                                                      // 15
        indexOptions.weights = options.weights();                                                                 // 16
      }                                                                                                           // 17
                                                                                                                  // 18
      rawCollection.createIndex(                                                                                  // 19
        indexDoc, indexOptions, function (err, res) {                                                             // 20
          options.onCreatedIndex && options.onCreatedIndex(res);                                                  // 21
        }                                                                                                         // 22
      );                                                                                                          // 23
    }                                                                                                             // 24
  },                                                                                                              // 25
  /**                                                                                                             // 26
   *                                                                                                              // 27
   * Perform a really simple search with mongo db.                                                                // 28
   *                                                                                                              // 29
   * @param {String} name                                                                                         // 30
   * @param {String} searchString                                                                                 // 31
   * @param {Object} options                                                                                      // 32
   * @param {Function} callback                                                                                   // 33
   * @returns {Object}                                                                                            // 34
   */                                                                                                             // 35
  'search' : function (name, searchString, options, callback) {                                                   // 36
    var cursor,                                                                                                   // 37
      results,                                                                                                    // 38
      selector,                                                                                                   // 39
      pipeline,                                                                                                   // 40
      aggregates,                                                                                                 // 41
      cursorOptions,                                                                                              // 42
      index = EasySearch.getIndex(name);                                                                          // 43
                                                                                                                  // 44
    if (!_.isObject(index)) {                                                                                     // 45
      return;                                                                                                     // 46
    }                                                                                                             // 47
                                                                                                                  // 48
    options.limit = options.limit || 10;                                                                          // 49
                                                                                                                  // 50
    // if several, fields do an $or search, otherwise only over the field                                         // 51
    selector = index.query(searchString, options);                                                                // 52
                                                                                                                  // 53
    if (!selector) {                                                                                              // 54
      return { total: 0, results: [] };                                                                           // 55
    }                                                                                                             // 56
                                                                                                                  // 57
    cursorOptions = {                                                                                             // 58
      sort : index.sort(searchString, options)                                                                    // 59
    };                                                                                                            // 60
                                                                                                                  // 61
    if (options.returnFields) {                                                                                   // 62
      cursorOptions.fields = EasySearch._transformToFieldSpecifiers(options.returnFields);                        // 63
    }                                                                                                             // 64
                                                                                                                  // 65
    if (options.skip) {                                                                                           // 66
      cursorOptions.skip = options.skip;                                                                          // 67
    }                                                                                                             // 68
                                                                                                                  // 69
    if (Meteor.isServer) {                                                                                        // 70
      cursorOptions.limit = options.limit;                                                                        // 71
    }                                                                                                             // 72
                                                                                                                  // 73
    if (options.useTextIndexes) {                                                                                 // 74
      if (!cursorOptions.fields) {                                                                                // 75
        cursorOptions.fields = {};                                                                                // 76
      }                                                                                                           // 77
                                                                                                                  // 78
      cursorOptions.fields.score = { $meta: 'textScore'  };                                                       // 79
    }                                                                                                             // 80
                                                                                                                  // 81
    cursor = index.collection.find(selector, cursorOptions);                                                      // 82
                                                                                                                  // 83
    if (Meteor.isServer) {                                                                                        // 84
      // Get the total count by aggregating                                                                       // 85
      pipeline = [                                                                                                // 86
        { $match: selector },                                                                                     // 87
        {                                                                                                         // 88
          $group: { _id: "id", total: { $sum: 1 } }                                                               // 89
        }                                                                                                         // 90
      ];                                                                                                          // 91
                                                                                                                  // 92
      aggregates = index.collection.aggregate(pipeline);                                                          // 93
                                                                                                                  // 94
      results = {                                                                                                 // 95
        'results': cursor.fetch(),                                                                                // 96
        'total': aggregates.length >= 1 ? aggregates[0].total : 0                                                 // 97
      };                                                                                                          // 98
    } else {                                                                                                      // 99
      // The aggregate operations are not supported on client,                                                    // 100
      // so we have to explicitly count all records in the search result                                          // 101
                                                                                                                  // 102
                                                                                                                  // 103
      results = {                                                                                                 // 104
        'results' : _.first(cursor.fetch(), options.limit),                                                       // 105
        'total' : cursor.count()                                                                                  // 106
      };                                                                                                          // 107
    }                                                                                                             // 108
                                                                                                                  // 109
    if (_.isFunction(callback)) {                                                                                 // 110
      callback(results);                                                                                          // 111
    }                                                                                                             // 112
                                                                                                                  // 113
    return results;                                                                                               // 114
  },                                                                                                              // 115
  /**                                                                                                             // 116
   * The default mongo-db query - selector used for searching.                                                    // 117
   *                                                                                                              // 118
   * @param {Object} conf                                                                                         // 119
   * @param {String} searchString                                                                                 // 120
   * @param {Function} regexCallback                                                                              // 121
   *                                                                                                              // 122
   * @returns {Object}                                                                                            // 123
   */                                                                                                             // 124
  'defaultQuery' : function (conf, searchString, regexCallback) {                                                 // 125
    if (Meteor.isServer && conf.useTextIndexes) {                                                                 // 126
      return { $text: { $search: searchString } };                                                                // 127
    } else if (Meteor.isClient || !conf.useTextIndexes) {                                                         // 128
      // Convert numbers if configured                                                                            // 129
      if (conf.convertNumbers && parseInt(searchString, 10) == searchString) {                                    // 130
        searchString = parseInt(searchString, 10);                                                                // 131
      }                                                                                                           // 132
                                                                                                                  // 133
      var stringSelector = { '$regex' : '.*' + searchString + '.*', '$options' : 'i'},                            // 134
        selector = {                                                                                              // 135
          $or: []                                                                                                 // 136
        };                                                                                                        // 137
                                                                                                                  // 138
      if (regexCallback) {                                                                                        // 139
        stringSelector['$regex'] = regexCallback(searchString);                                                   // 140
      }                                                                                                           // 141
                                                                                                                  // 142
      _.each(conf.field, function (fieldString) {                                                                 // 143
        var orSelector = {};                                                                                      // 144
                                                                                                                  // 145
        if (_.isString(searchString)) {                                                                           // 146
          orSelector[fieldString] = stringSelector;                                                               // 147
        } else if (_.isNumber(searchString)) {                                                                    // 148
          orSelector[fieldString] = searchString;                                                                 // 149
        }                                                                                                         // 150
                                                                                                                  // 151
        selector['$or'].push(orSelector);                                                                         // 152
      });                                                                                                         // 153
                                                                                                                  // 154
      return selector;                                                                                            // 155
    }                                                                                                             // 156
  },                                                                                                              // 157
  /**                                                                                                             // 158
   * The default mongo-db sorting method used for sorting the results.                                            // 159
   *                                                                                                              // 160
   * @param {Object} conf                                                                                         // 161
   * @return array                                                                                                // 162
   */                                                                                                             // 163
  'defaultSort' : function (conf) {                                                                               // 164
    return conf.field;                                                                                            // 165
  }                                                                                                               // 166
};                                                                                                                // 167
                                                                                                                  // 168
if (Meteor.isClient) {                                                                                            // 169
  EasySearch.createSearcher('minimongo', methods);                                                                // 170
} else if (Meteor.isServer) {                                                                                     // 171
  EasySearch.createSearcher('mongo-db', methods);                                                                 // 172
}                                                                                                                 // 173
                                                                                                                  // 174
                                                                                                                  // 175
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/matteodem_easy-search/lib/easy-search-server.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
'use strict';                                                                                                     // 1
var ElasticSearch = Npm.require('elasticsearch');                                                                 // 2
                                                                                                                  // 3
EasySearch._esDefaultConfig = {                                                                                   // 4
  host : 'localhost:9200'                                                                                         // 5
};                                                                                                                // 6
                                                                                                                  // 7
/**                                                                                                               // 8
 * Override the config for Elastic Search.                                                                        // 9
 *                                                                                                                // 10
 * @param {object} newConfig                                                                                      // 11
 */                                                                                                               // 12
EasySearch.config = function (newConfig) {                                                                        // 13
  if ("undefined" !== typeof newConfig) {                                                                         // 14
    check(newConfig, Object);                                                                                     // 15
    this._config = _.extend(this._esDefaultConfig, newConfig);                                                    // 16
    this.ElasticSearchClient = new ElasticSearch.Client(this._config);                                            // 17
  }                                                                                                               // 18
                                                                                                                  // 19
  return this._config;                                                                                            // 20
};                                                                                                                // 21
                                                                                                                  // 22
/**                                                                                                               // 23
 * Get the ElasticSearchClient                                                                                    // 24
 * @see http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current                         // 25
 *                                                                                                                // 26
 * @return {ElasticSearch.Client}                                                                                 // 27
 */                                                                                                               // 28
EasySearch.getElasticSearchClient = function () {                                                                 // 29
  return this.ElasticSearchClient;                                                                                // 30
};                                                                                                                // 31
                                                                                                                  // 32
/**                                                                                                               // 33
 * Transforms the field definition to a MongoDB index doc definition.                                             // 34
 *                                                                                                                // 35
 * @param {Array} fields                                                                                          // 36
 *                                                                                                                // 37
 * @returns {Object}                                                                                              // 38
 */                                                                                                               // 39
EasySearch._transformFieldsToIndexDocument = function (fields) {                                                  // 40
  var indexDoc = {};                                                                                              // 41
                                                                                                                  // 42
  _.each(fields, function (field) {                                                                               // 43
    indexDoc[field] = 'text';                                                                                     // 44
  });                                                                                                             // 45
                                                                                                                  // 46
  return indexDoc;                                                                                                // 47
};                                                                                                                // 48
                                                                                                                  // 49
Meteor.methods({                                                                                                  // 50
  /**                                                                                                             // 51
   * Make server side search possible on the client.                                                              // 52
   *                                                                                                              // 53
   * @param {String} name                                                                                         // 54
   * @param {String} searchString                                                                                 // 55
   * @param {Object} options                                                                                      // 56
   */                                                                                                             // 57
  easySearch: function (name, searchString, options) {                                                            // 58
    check(name, String);                                                                                          // 59
    check(searchString, String);                                                                                  // 60
    check(options, Object);                                                                                       // 61
    return EasySearch.search(name, searchString, options);                                                        // 62
  }                                                                                                               // 63
});                                                                                                               // 64
                                                                                                                  // 65
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/matteodem_easy-search/lib/searchers/elastic-search.js                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
'use strict';                                                                                                     // 1
                                                                                                                  // 2
var Future = Npm.require('fibers/future'),                                                                        // 3
  ElasticSearch = Npm.require('elasticsearch');                                                                   // 4
                                                                                                                  // 5
/**                                                                                                               // 6
 * Return Elastic Search indexable data.                                                                          // 7
 *                                                                                                                // 8
 * @param {Object} doc the document to get the values from                                                        // 9
 * @return {Object}                                                                                               // 10
 */                                                                                                               // 11
function getESFields(doc) {                                                                                       // 12
  var newDoc = {};                                                                                                // 13
                                                                                                                  // 14
  _.each(doc, function (value, key) {                                                                             // 15
    newDoc[key] = _.isObject(value) && !_.isArray(value) && !_.isDate(value) ? JSON.stringify(value) : value;     // 16
  });                                                                                                             // 17
                                                                                                                  // 18
  return newDoc;                                                                                                  // 19
}                                                                                                                 // 20
                                                                                                                  // 21
EasySearch.createSearcher('elastic-search', {                                                                     // 22
  /**                                                                                                             // 23
   * Write a document to a specified index.                                                                       // 24
   *                                                                                                              // 25
   * @param {String} name                                                                                         // 26
   * @param {Object} doc                                                                                          // 27
   * @param {String} id                                                                                           // 28
   * @param {Object} opts                                                                                         // 29
   * @param {Object} config                                                                                       // 30
   */                                                                                                             // 31
  'writeToIndex' : function (name, doc, id, opts, config) {                                                       // 32
    var debugMode = config.debug,                                                                                 // 33
        transformedDoc = opts.transform(doc);                                                                     // 34
                                                                                                                  // 35
    if (_.isObject(transformedDoc)) {                                                                             // 36
      doc = transformedDoc;                                                                                       // 37
    }                                                                                                             // 38
                                                                                                                  // 39
    // add to index                                                                                               // 40
    EasySearch.ElasticSearchClient.index({                                                                        // 41
      index : name.toLowerCase(),                                                                                 // 42
      type : 'default',                                                                                           // 43
      id : id,                                                                                                    // 44
      body : doc                                                                                                  // 45
    }, function (err, data) {                                                                                     // 46
      if (err) {                                                                                                  // 47
        console.log('Had error adding a document!');                                                              // 48
        console.log(err);                                                                                         // 49
      }                                                                                                           // 50
                                                                                                                  // 51
      if (debugMode && console) {                                                                                 // 52
        console.log('EasySearch: Added / Replaced document to Elastic Search:');                                  // 53
        console.log('EasySearch: ' + data + "\n");                                                                // 54
      }                                                                                                           // 55
    });                                                                                                           // 56
  },                                                                                                              // 57
  /**                                                                                                             // 58
   * Setup some observers on the mongo db collection provided.                                                    // 59
   *                                                                                                              // 60
   * @param {String} name                                                                                         // 61
   * @param {Object} options                                                                                      // 62
   */                                                                                                             // 63
  'createSearchIndex' : function (name, options) {                                                                // 64
    var searcherScope = this,                                                                                     // 65
      config = EasySearch.config() || {};                                                                         // 66
                                                                                                                  // 67
    if ("undefined" === typeof EasySearch.ElasticSearchClient) {                                                  // 68
      EasySearch.ElasticSearchClient = new ElasticSearch.Client(this._esDefaultConfig);                           // 69
    }                                                                                                             // 70
                                                                                                                  // 71
    name = name.toLowerCase();                                                                                    // 72
                                                                                                                  // 73
    options.collection.find().observeChanges({                                                                    // 74
      added: function (id, fields) {                                                                              // 75
        searcherScope.writeToIndex(name, getESFields(fields), id, options, config);                               // 76
      },                                                                                                          // 77
      changed: function (id) {                                                                                    // 78
        // Overwrites the current document with the new doc                                                       // 79
        searcherScope.writeToIndex(name, getESFields(options.collection.findOne(id)), id, options, config);       // 80
      },                                                                                                          // 81
      removed: function (id) {                                                                                    // 82
        EasySearch.ElasticSearchClient.delete({                                                                   // 83
          index: name,                                                                                            // 84
          type: 'default',                                                                                        // 85
          id: id                                                                                                  // 86
        }, function (error, response) {                                                                           // 87
          if (config.debug) {                                                                                     // 88
            console.log('Removed document with id ( ' +  id + ' )!');                                             // 89
          }                                                                                                       // 90
        });                                                                                                       // 91
      }                                                                                                           // 92
    });                                                                                                           // 93
  },                                                                                                              // 94
  /**                                                                                                             // 95
   * Get the data out of the JSON elastic search response.                                                        // 96
   *                                                                                                              // 97
   * @param {Object} data                                                                                         // 98
   * @returns {Array}                                                                                             // 99
   */                                                                                                             // 100
  'extractJSONData' : function (data) {                                                                           // 101
    data = _.isString(data) ? JSON.parse(data) : data;                                                            // 102
                                                                                                                  // 103
    var results = _.map(data.hits.hits, function (resultSet) {                                                    // 104
      var field = '_source';                                                                                      // 105
                                                                                                                  // 106
      if (resultSet['fields']) {                                                                                  // 107
        field = 'fields';                                                                                         // 108
      }                                                                                                           // 109
                                                                                                                  // 110
      resultSet[field]['_id'] = resultSet['_id'];                                                                 // 111
      return resultSet[field];                                                                                    // 112
    });                                                                                                           // 113
                                                                                                                  // 114
    return {                                                                                                      // 115
      'results' : results,                                                                                        // 116
      'total' : data.hits.total                                                                                   // 117
    };                                                                                                            // 118
  },                                                                                                              // 119
  /**                                                                                                             // 120
   * Perform a search with Elastic Search, using fibers.                                                          // 121
   *                                                                                                              // 122
   * @param {String} name                                                                                         // 123
   * @param {String} searchString                                                                                 // 124
   * @param {Object} options                                                                                      // 125
   * @param {Function} callback                                                                                   // 126
   * @returns {*}                                                                                                 // 127
   */                                                                                                             // 128
  'search' : function (name, searchString, options, callback) {                                                   // 129
    var bodyObj,                                                                                                  // 130
      that = this,                                                                                                // 131
      fut = new Future(),                                                                                         // 132
      index = EasySearch.getIndex(name);                                                                          // 133
                                                                                                                  // 134
    if (!_.isObject(index)) {                                                                                     // 135
      return;                                                                                                     // 136
    }                                                                                                             // 137
                                                                                                                  // 138
    bodyObj = {                                                                                                   // 139
      "query" : index.query(searchString, options)                                                                // 140
    };                                                                                                            // 141
                                                                                                                  // 142
    if (!bodyObj.query) {                                                                                         // 143
      return { total: 0, results: [] };                                                                           // 144
    }                                                                                                             // 145
                                                                                                                  // 146
    bodyObj.sort = index.sort(searchString, options);                                                             // 147
                                                                                                                  // 148
    if (options.returnFields) {                                                                                   // 149
      if (options.returnFields.indexOf('_id') === -1 ) {                                                          // 150
        options.returnFields.push('_id');                                                                         // 151
      }                                                                                                           // 152
                                                                                                                  // 153
      bodyObj.fields = options.returnFields;                                                                      // 154
    }                                                                                                             // 155
                                                                                                                  // 156
    // Modify Elastic Search body if wished                                                                       // 157
    if (index.body && _.isFunction(index.body)) {                                                                 // 158
      bodyObj = index.body(bodyObj, options);                                                                     // 159
    }                                                                                                             // 160
                                                                                                                  // 161
    name = name.toLowerCase();                                                                                    // 162
                                                                                                                  // 163
    if ("function" === typeof callback) {                                                                         // 164
      EasySearch.ElasticSearchClient.search(name, bodyObj, callback);                                             // 165
      return;                                                                                                     // 166
    }                                                                                                             // 167
                                                                                                                  // 168
    // Most likely client call, return data set                                                                   // 169
    EasySearch.ElasticSearchClient.search({                                                                       // 170
      index : name,                                                                                               // 171
      body : bodyObj,                                                                                             // 172
      size : options.limit,                                                                                       // 173
      from: options.skip                                                                                          // 174
    }, function (error, data) {                                                                                   // 175
      if (error) {                                                                                                // 176
        console.log('Had an error while searching!');                                                             // 177
        console.log(error);                                                                                       // 178
        return;                                                                                                   // 179
      }                                                                                                           // 180
                                                                                                                  // 181
      if ("raw" !== index.format) {                                                                               // 182
        data = that.extractJSONData(data);                                                                        // 183
      }                                                                                                           // 184
                                                                                                                  // 185
      fut['return'](data);                                                                                        // 186
    });                                                                                                           // 187
                                                                                                                  // 188
    return fut.wait();                                                                                            // 189
  },                                                                                                              // 190
  /**                                                                                                             // 191
   * The default ES query object used for searching the results.                                                  // 192
   *                                                                                                              // 193
   * @param {Object} options                                                                                      // 194
   * @param {String} searchString                                                                                 // 195
   * @return array                                                                                                // 196
   */                                                                                                             // 197
  'defaultQuery' : function (options, searchString) {                                                             // 198
    return {                                                                                                      // 199
      "fuzzy_like_this" : {                                                                                       // 200
        "fields" : options.field,                                                                                 // 201
        "like_text" : searchString                                                                                // 202
      }                                                                                                           // 203
    };                                                                                                            // 204
  },                                                                                                              // 205
  /**                                                                                                             // 206
   * The default ES sorting method used for sorting the results.                                                  // 207
   *                                                                                                              // 208
   * @param {Object} options                                                                                      // 209
   * @return array                                                                                                // 210
   */                                                                                                             // 211
  'defaultSort' : function (options) {                                                                            // 212
    return options.field;                                                                                         // 213
  }                                                                                                               // 214
});                                                                                                               // 215
                                                                                                                  // 216
// Expose ElasticSearch API                                                                                       // 217
EasySearch.ElasticSearch = ElasticSearch;                                                                         // 218
                                                                                                                  // 219
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['matteodem:easy-search'] = {
  EasySearch: EasySearch
};

})();

//# sourceMappingURL=matteodem_easy-search.js.map
