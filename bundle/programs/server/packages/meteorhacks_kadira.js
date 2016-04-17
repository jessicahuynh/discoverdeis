(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MeteorX = Package['meteorhacks:meteorx'].MeteorX;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Random = Package.random.Random;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var Kadira, BaseErrorModel, Retry, HaveAsyncCallback, UniqueId, DefaultUniqueId, OptimizedApply, Ntp, WaitTimeBuilder, OplogCheck, Tracer, TracerStore, KadiraModel, MethodsModel, PubsubModel, collectionName, SystemModel, ErrorModel, wrapServer, wrapSession, wrapSubscription, wrapOplogObserveDriver, wrapPollingObserveDriver, wrapMultiplexer, wrapForCountingObservers, hijackDBOps, TrackUncaughtExceptions, TrackMeteorDebug, setLabels;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/common/unify.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira = {};                                                                                                          // 1
Kadira.options = {};                                                                                                  // 2
                                                                                                                      // 3
if(Meteor.wrapAsync) {                                                                                                // 4
  Kadira._wrapAsync = Meteor.wrapAsync;                                                                               // 5
} else {                                                                                                              // 6
  Kadira._wrapAsync = Meteor._wrapAsync;                                                                              // 7
}                                                                                                                     // 8
                                                                                                                      // 9
if(Meteor.isServer) {                                                                                                 // 10
  var EventEmitter = Npm.require('events').EventEmitter;                                                              // 11
  var eventBus = new EventEmitter();                                                                                  // 12
  eventBus.setMaxListeners(0);                                                                                        // 13
                                                                                                                      // 14
  var buildArgs = function(args) {                                                                                    // 15
    args = _.toArray(args);                                                                                           // 16
    var eventName = args[0] + '-' + args[1];                                                                          // 17
    var args = args.slice(2);                                                                                         // 18
    args.unshift(eventName);                                                                                          // 19
    return args;                                                                                                      // 20
  };                                                                                                                  // 21
                                                                                                                      // 22
  Kadira.EventBus = {};                                                                                               // 23
  _.each(['on', 'emit', 'removeListener', 'removeAllListeners'], function(m) {                                        // 24
    Kadira.EventBus[m] = function() {                                                                                 // 25
      var args = buildArgs(arguments);                                                                                // 26
      return eventBus[m].apply(eventBus, args);                                                                       // 27
    };                                                                                                                // 28
  });                                                                                                                 // 29
}                                                                                                                     // 30
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/models/base_error.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
BaseErrorModel = function(options) {                                                                                  // 1
  this._filters = [];                                                                                                 // 2
};                                                                                                                    // 3
                                                                                                                      // 4
BaseErrorModel.prototype.addFilter = function(filter) {                                                               // 5
  if(typeof filter === 'function') {                                                                                  // 6
    this._filters.push(filter);                                                                                       // 7
  } else {                                                                                                            // 8
    throw new Error("Error filter must be a function");                                                               // 9
  }                                                                                                                   // 10
};                                                                                                                    // 11
                                                                                                                      // 12
BaseErrorModel.prototype.removeFilter = function(filter) {                                                            // 13
  var index = this._filters.indexOf(filter);                                                                          // 14
  if(index >= 0) {                                                                                                    // 15
    this._filters.splice(index, 1);                                                                                   // 16
  }                                                                                                                   // 17
};                                                                                                                    // 18
                                                                                                                      // 19
BaseErrorModel.prototype.applyFilters = function(type, message, error, subType) {                                     // 20
  for(var lc=0; lc<this._filters.length; lc++) {                                                                      // 21
    var filter = this._filters[lc];                                                                                   // 22
    try {                                                                                                             // 23
      var validated = filter(type, message, error, subType);                                                          // 24
      if(!validated) return false;                                                                                    // 25
    } catch (ex) {                                                                                                    // 26
      // we need to remove this filter                                                                                // 27
      // we may ended up in a error cycle                                                                             // 28
      this._filters.splice(lc, 1);                                                                                    // 29
      throw new Error("an error thrown from a filter you've suplied", ex.message);                                    // 30
    }                                                                                                                 // 31
  }                                                                                                                   // 32
                                                                                                                      // 33
  return true;                                                                                                        // 34
};                                                                                                                    // 35
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/jobs.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Jobs = Kadira.Jobs = {};                                                                                          // 1
                                                                                                                      // 2
Jobs.getAsync = function(id, callback) {                                                                              // 3
  Kadira.coreApi.getJob(id)                                                                                           // 4
    .then(function(data) {                                                                                            // 5
      callback(null, data);                                                                                           // 6
    })                                                                                                                // 7
    .catch(function(err) {                                                                                            // 8
      callback(err)                                                                                                   // 9
    });                                                                                                               // 10
};                                                                                                                    // 11
                                                                                                                      // 12
                                                                                                                      // 13
Jobs.setAsync = function(id, changes, callback) {                                                                     // 14
  Kadira.coreApi.updateJob(id, changes)                                                                               // 15
    .then(function(data) {                                                                                            // 16
      callback(null, data);                                                                                           // 17
    })                                                                                                                // 18
    .catch(function(err) {                                                                                            // 19
      callback(err)                                                                                                   // 20
    });                                                                                                               // 21
};                                                                                                                    // 22
                                                                                                                      // 23
Jobs.set = Kadira._wrapAsync(Jobs.setAsync);                                                                          // 24
Jobs.get = Kadira._wrapAsync(Jobs.getAsync);                                                                          // 25
                                                                                                                      // 26
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/retry.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Retry logic with an exponential backoff.                                                                           // 1
//                                                                                                                    // 2
// options:                                                                                                           // 3
//  baseTimeout: time for initial reconnect attempt (ms).                                                             // 4
//  exponent: exponential factor to increase timeout each attempt.                                                    // 5
//  maxTimeout: maximum time between retries (ms).                                                                    // 6
//  minCount: how many times to reconnect "instantly".                                                                // 7
//  minTimeout: time to wait for the first `minCount` retries (ms).                                                   // 8
//  fuzz: factor to randomize retry times by (to avoid retry storms).                                                 // 9
                                                                                                                      // 10
//TODO: remove this class and use Meteor Retry in a later version of meteor.                                          // 11
                                                                                                                      // 12
Retry = function (options) {                                                                                          // 13
  var self = this;                                                                                                    // 14
  _.extend(self, _.defaults(_.clone(options || {}), {                                                                 // 15
    baseTimeout: 1000, // 1 second                                                                                    // 16
    exponent: 2.2,                                                                                                    // 17
    // The default is high-ish to ensure a server can recover from a                                                  // 18
    // failure caused by load.                                                                                        // 19
    maxTimeout: 5 * 60000, // 5 minutes                                                                               // 20
    minTimeout: 10,                                                                                                   // 21
    minCount: 2,                                                                                                      // 22
    fuzz: 0.5 // +- 25%                                                                                               // 23
  }));                                                                                                                // 24
  self.retryTimer = null;                                                                                             // 25
};                                                                                                                    // 26
                                                                                                                      // 27
_.extend(Retry.prototype, {                                                                                           // 28
                                                                                                                      // 29
  // Reset a pending retry, if any.                                                                                   // 30
  clear: function () {                                                                                                // 31
    var self = this;                                                                                                  // 32
    if(self.retryTimer)                                                                                               // 33
      clearTimeout(self.retryTimer);                                                                                  // 34
    self.retryTimer = null;                                                                                           // 35
  },                                                                                                                  // 36
                                                                                                                      // 37
  // Calculate how long to wait in milliseconds to retry, based on the                                                // 38
  // `count` of which retry this is.                                                                                  // 39
  _timeout: function (count) {                                                                                        // 40
    var self = this;                                                                                                  // 41
                                                                                                                      // 42
    if(count < self.minCount)                                                                                         // 43
      return self.minTimeout;                                                                                         // 44
                                                                                                                      // 45
    var timeout = Math.min(                                                                                           // 46
      self.maxTimeout,                                                                                                // 47
      self.baseTimeout * Math.pow(self.exponent, count));                                                             // 48
    // fuzz the timeout randomly, to avoid reconnect storms when a                                                    // 49
    // server goes down.                                                                                              // 50
    timeout = timeout * ((Random.fraction() * self.fuzz) +                                                            // 51
                         (1 - self.fuzz/2));                                                                          // 52
    return Math.ceil(timeout);                                                                                        // 53
  },                                                                                                                  // 54
                                                                                                                      // 55
  // Call `fn` after a delay, based on the `count` of which retry this is.                                            // 56
  retryLater: function (count, fn) {                                                                                  // 57
    var self = this;                                                                                                  // 58
    var timeout = self._timeout(count);                                                                               // 59
    if(self.retryTimer)                                                                                               // 60
      clearTimeout(self.retryTimer);                                                                                  // 61
                                                                                                                      // 62
    self.retryTimer = setTimeout(fn, timeout);                                                                        // 63
    return timeout;                                                                                                   // 64
  }                                                                                                                   // 65
                                                                                                                      // 66
});                                                                                                                   // 67
                                                                                                                      // 68
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/utils.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
                                                                                                                      // 2
HaveAsyncCallback = function(args) {                                                                                  // 3
  var lastArg = args[args.length -1];                                                                                 // 4
  return (typeof lastArg) == 'function';                                                                              // 5
};                                                                                                                    // 6
                                                                                                                      // 7
UniqueId = function(start) {                                                                                          // 8
  this.id = 0;                                                                                                        // 9
}                                                                                                                     // 10
                                                                                                                      // 11
UniqueId.prototype.get = function() {                                                                                 // 12
  return "" + this.id++;                                                                                              // 13
};                                                                                                                    // 14
                                                                                                                      // 15
DefaultUniqueId = new UniqueId();                                                                                     // 16
                                                                                                                      // 17
// Optimized version of apply which tries to call as possible as it can                                               // 18
// Then fall back to apply                                                                                            // 19
// This is because, v8 is very slow to invoke apply.                                                                  // 20
OptimizedApply = function OptimizedApply(context, fn, args) {                                                         // 21
  var a = args;                                                                                                       // 22
  switch(a.length) {                                                                                                  // 23
    case 0:                                                                                                           // 24
      return fn.call(context);                                                                                        // 25
    case 1:                                                                                                           // 26
      return fn.call(context, a[0]);                                                                                  // 27
    case 2:                                                                                                           // 28
      return fn.call(context, a[0], a[1]);                                                                            // 29
    case 3:                                                                                                           // 30
      return fn.call(context, a[0], a[1], a[2]);                                                                      // 31
    case 4:                                                                                                           // 32
      return fn.call(context, a[0], a[1], a[2], a[3]);                                                                // 33
    case 5:                                                                                                           // 34
      return fn.call(context, a[0], a[1], a[2], a[3], a[4]);                                                          // 35
    default:                                                                                                          // 36
      return fn.apply(context, a);                                                                                    // 37
  }                                                                                                                   // 38
}                                                                                                                     // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/ntp.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = getLogger();                                                                                             // 1
                                                                                                                      // 2
Ntp = function (endpoint) {                                                                                           // 3
  this.setEndpoint(endpoint);                                                                                         // 4
  this.diff = 0;                                                                                                      // 5
  this.synced = false;                                                                                                // 6
  this.reSyncCount = 0;                                                                                               // 7
  this.reSync = new Retry({                                                                                           // 8
    baseTimeout: 1000*60,                                                                                             // 9
    maxTimeout: 1000*60*10,                                                                                           // 10
    minCount: 0                                                                                                       // 11
  });                                                                                                                 // 12
}                                                                                                                     // 13
                                                                                                                      // 14
Ntp._now = function() {                                                                                               // 15
  var now = Date.now();                                                                                               // 16
  if(typeof now == 'number') {                                                                                        // 17
    return now;                                                                                                       // 18
  } else if(now instanceof Date) {                                                                                    // 19
    // some extenal JS libraries override Date.now and returns a Date object                                          // 20
    // which directly affect us. So we need to prepare for that                                                       // 21
    return now.getTime();                                                                                             // 22
  } else {                                                                                                            // 23
    // trust me. I've seen now === undefined                                                                          // 24
    return (new Date()).getTime();                                                                                    // 25
  }                                                                                                                   // 26
};                                                                                                                    // 27
                                                                                                                      // 28
Ntp.prototype.setEndpoint = function(endpoint) {                                                                      // 29
  this.endpoint = endpoint + '/simplentp/sync';                                                                       // 30
};                                                                                                                    // 31
                                                                                                                      // 32
Ntp.prototype.getTime = function() {                                                                                  // 33
  return Ntp._now() + Math.round(this.diff);                                                                          // 34
};                                                                                                                    // 35
                                                                                                                      // 36
Ntp.prototype.syncTime = function(localTime) {                                                                        // 37
  return localTime + Math.ceil(this.diff);                                                                            // 38
};                                                                                                                    // 39
                                                                                                                      // 40
Ntp.prototype.sync = function() {                                                                                     // 41
  logger('init sync');                                                                                                // 42
  var self = this;                                                                                                    // 43
  var retryCount = 0;                                                                                                 // 44
  var retry = new Retry({                                                                                             // 45
    baseTimeout: 1000*20,                                                                                             // 46
    maxTimeout: 1000*60,                                                                                              // 47
    minCount: 1,                                                                                                      // 48
    minTimeout: 0                                                                                                     // 49
  });                                                                                                                 // 50
  syncTime();                                                                                                         // 51
                                                                                                                      // 52
  function syncTime () {                                                                                              // 53
    if(retryCount<5) {                                                                                                // 54
      logger('attempt time sync with server', retryCount);                                                            // 55
      // if we send 0 to the retryLater, cacheDns will run immediately                                                // 56
      retry.retryLater(retryCount++, cacheDns);                                                                       // 57
    } else {                                                                                                          // 58
      logger('maximum retries reached');                                                                              // 59
      self.reSync.retryLater(self.reSyncCount++, function () {                                                        // 60
        var args = [].slice.call(arguments);                                                                          // 61
        self.sync.apply(self, args);                                                                                  // 62
      });                                                                                                             // 63
    }                                                                                                                 // 64
  }                                                                                                                   // 65
                                                                                                                      // 66
  // first attempt is to cache dns. So, calculation does not                                                          // 67
  // include DNS resolution time                                                                                      // 68
  function cacheDns () {                                                                                              // 69
    self.getServerTime(function(err) {                                                                                // 70
      if(!err) {                                                                                                      // 71
        calculateTimeDiff();                                                                                          // 72
      } else {                                                                                                        // 73
        syncTime();                                                                                                   // 74
      }                                                                                                               // 75
    });                                                                                                               // 76
  }                                                                                                                   // 77
                                                                                                                      // 78
  function calculateTimeDiff () {                                                                                     // 79
    var clientStartTime = (new Date()).getTime();                                                                     // 80
    self.getServerTime(function(err, serverTime) {                                                                    // 81
      if(!err && serverTime) {                                                                                        // 82
        // (Date.now() + clientStartTime)/2 : Midpoint between req and res                                            // 83
        var networkTime = ((new Date()).getTime() - clientStartTime)/2                                                // 84
        var serverStartTime = serverTime - networkTime;                                                               // 85
        self.diff = serverStartTime - clientStartTime;                                                                // 86
        self.synced = true;                                                                                           // 87
        // we need to send 1 into retryLater.                                                                         // 88
        self.reSync.retryLater(self.reSyncCount++, function () {                                                      // 89
          var args = [].slice.call(arguments);                                                                        // 90
          self.sync.apply(self, args);                                                                                // 91
        });                                                                                                           // 92
        logger('successfully updated diff value', self.diff);                                                         // 93
      } else {                                                                                                        // 94
        syncTime();                                                                                                   // 95
      }                                                                                                               // 96
    });                                                                                                               // 97
  }                                                                                                                   // 98
}                                                                                                                     // 99
                                                                                                                      // 100
Ntp.prototype.getServerTime = function(callback) {                                                                    // 101
  var self = this;                                                                                                    // 102
                                                                                                                      // 103
  if(Meteor.isServer) {                                                                                               // 104
    var Fiber = Npm.require('fibers');                                                                                // 105
    new Fiber(function() {                                                                                            // 106
      HTTP.get(self.endpoint, function (err, res) {                                                                   // 107
        if(err) {                                                                                                     // 108
          callback(err);                                                                                              // 109
        } else {                                                                                                      // 110
          var serverTime = parseInt(res.content)                                                                      // 111
          callback(null, serverTime);                                                                                 // 112
        }                                                                                                             // 113
      });                                                                                                             // 114
    }).run();                                                                                                         // 115
  } else {                                                                                                            // 116
    $.ajax({                                                                                                          // 117
      type: 'GET',                                                                                                    // 118
      url: self.endpoint,                                                                                             // 119
      success: function(serverTime) {                                                                                 // 120
        callback(null, parseInt(serverTime));                                                                         // 121
      },                                                                                                              // 122
      error: function(err) {                                                                                          // 123
        callback(err);                                                                                                // 124
      }                                                                                                               // 125
    });                                                                                                               // 126
  }                                                                                                                   // 127
};                                                                                                                    // 128
                                                                                                                      // 129
function getLogger() {                                                                                                // 130
  if(Meteor.isServer) {                                                                                               // 131
    return Npm.require('debug')("kadira:ntp");                                                                        // 132
  } else {                                                                                                            // 133
    return function(message) {                                                                                        // 134
      var canLogKadira =                                                                                              // 135
        Meteor._localStorage.getItem('LOG_KADIRA') !== null                                                           // 136
        && typeof console !== 'undefined';                                                                            // 137
                                                                                                                      // 138
      if(canLogKadira) {                                                                                              // 139
        if(message) {                                                                                                 // 140
          message = "kadira:ntp " + message;                                                                          // 141
          arguments[0] = message;                                                                                     // 142
        }                                                                                                             // 143
        console.log.apply(console, arguments);                                                                        // 144
      }                                                                                                               // 145
    }                                                                                                                 // 146
  }                                                                                                                   // 147
}                                                                                                                     // 148
                                                                                                                      // 149
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/wait_time_builder.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var WAITON_MESSAGE_FIELDS = ['msg', 'id', 'method', 'name', 'waitTime'];                                              // 1
                                                                                                                      // 2
// This is way how we can build waitTime and it's breakdown                                                           // 3
WaitTimeBuilder = function() {                                                                                        // 4
  this._waitListStore = {};                                                                                           // 5
  this._currentProcessingMessages = {};                                                                               // 6
  this._messageCache = {};                                                                                            // 7
};                                                                                                                    // 8
                                                                                                                      // 9
WaitTimeBuilder.prototype.register = function(session, msgId) {                                                       // 10
  var self = this;                                                                                                    // 11
  var mainKey = self._getMessageKey(session.id, msgId);                                                               // 12
                                                                                                                      // 13
  var inQueue = session.inQueue || [];                                                                                // 14
  if(typeof inQueue.toArray === 'function') {                                                                         // 15
    // latest version of Meteor uses a double-ended-queue for the inQueue                                             // 16
    // info: https://www.npmjs.com/package/double-ended-queue                                                         // 17
    inQueue = inQueue.toArray();                                                                                      // 18
  }                                                                                                                   // 19
                                                                                                                      // 20
  var waitList = inQueue.map(function(msg) {                                                                          // 21
    var key = self._getMessageKey(session.id, msg.id);                                                                // 22
    return self._getCacheMessage(key, msg);                                                                           // 23
  });                                                                                                                 // 24
                                                                                                                      // 25
  waitList = waitList || [];                                                                                          // 26
                                                                                                                      // 27
  //add currently processing ddp message if exists                                                                    // 28
  var currentlyProcessingMessage = this._currentProcessingMessages[session.id];                                       // 29
  if(currentlyProcessingMessage) {                                                                                    // 30
    var key = self._getMessageKey(session.id, currentlyProcessingMessage.id);                                         // 31
    waitList.unshift(this._getCacheMessage(key, currentlyProcessingMessage));                                         // 32
  }                                                                                                                   // 33
                                                                                                                      // 34
  this._waitListStore[mainKey] = waitList;                                                                            // 35
};                                                                                                                    // 36
                                                                                                                      // 37
WaitTimeBuilder.prototype.build = function(session, msgId) {                                                          // 38
  var mainKey = this._getMessageKey(session.id, msgId);                                                               // 39
  var waitList = this._waitListStore[mainKey] || [];                                                                  // 40
  delete this._waitListStore[mainKey];                                                                                // 41
                                                                                                                      // 42
  var filteredWaitList =  waitList.map(this._cleanCacheMessage.bind(this));                                           // 43
  return filteredWaitList;                                                                                            // 44
};                                                                                                                    // 45
                                                                                                                      // 46
WaitTimeBuilder.prototype._getMessageKey = function(sessionId, msgId) {                                               // 47
  return sessionId + "::" + msgId;                                                                                    // 48
};                                                                                                                    // 49
                                                                                                                      // 50
WaitTimeBuilder.prototype._getCacheMessage = function(key, msg) {                                                     // 51
  var self = this;                                                                                                    // 52
  var cachedMessage = self._messageCache[key];                                                                        // 53
  if(!cachedMessage) {                                                                                                // 54
    self._messageCache[key] = cachedMessage = _.pick(msg, WAITON_MESSAGE_FIELDS);                                     // 55
    cachedMessage._key = key;                                                                                         // 56
    cachedMessage._registered = 1;                                                                                    // 57
  } else {                                                                                                            // 58
    cachedMessage._registered++;                                                                                      // 59
  }                                                                                                                   // 60
                                                                                                                      // 61
  return cachedMessage;                                                                                               // 62
};                                                                                                                    // 63
                                                                                                                      // 64
WaitTimeBuilder.prototype._cleanCacheMessage = function(msg) {                                                        // 65
  msg._registered--;                                                                                                  // 66
  if(msg._registered == 0) {                                                                                          // 67
    delete this._messageCache[msg._key];                                                                              // 68
  }                                                                                                                   // 69
                                                                                                                      // 70
  // need to send a clean set of objects                                                                              // 71
  // otherwise register can go with this                                                                              // 72
  return _.pick(msg, WAITON_MESSAGE_FIELDS);                                                                          // 73
};                                                                                                                    // 74
                                                                                                                      // 75
WaitTimeBuilder.prototype.trackWaitTime = function(session, msg, unblock) {                                           // 76
  var self = this;                                                                                                    // 77
  var started = Date.now();                                                                                           // 78
  self._currentProcessingMessages[session.id] = msg;                                                                  // 79
                                                                                                                      // 80
  var unblocked = false;                                                                                              // 81
  var wrappedUnblock = function() {                                                                                   // 82
    if(!unblocked) {                                                                                                  // 83
      var waitTime = Date.now() - started;                                                                            // 84
      var key = self._getMessageKey(session.id, msg.id);                                                              // 85
      var cachedMessage = self._messageCache[key];                                                                    // 86
      if(cachedMessage) {                                                                                             // 87
        cachedMessage.waitTime = waitTime;                                                                            // 88
      }                                                                                                               // 89
      delete self._currentProcessingMessages[session.id];                                                             // 90
      unblocked = true;                                                                                               // 91
      unblock();                                                                                                      // 92
    }                                                                                                                 // 93
  };                                                                                                                  // 94
                                                                                                                      // 95
  return wrappedUnblock;                                                                                              // 96
};                                                                                                                    // 97
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/check_for_oplog.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// expose for testing purpose                                                                                         // 1
OplogCheck = {};                                                                                                      // 2
                                                                                                                      // 3
OplogCheck._070 = function(cursorDescription) {                                                                       // 4
  var options = cursorDescription.options;                                                                            // 5
  if (options.limit) {                                                                                                // 6
    return {                                                                                                          // 7
      code: "070_LIMIT_NOT_SUPPORTED",                                                                                // 8
      reason: "Meteor 0.7.0 does not support limit with oplog.",                                                      // 9
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 10
    }                                                                                                                 // 11
  };                                                                                                                  // 12
                                                                                                                      // 13
  var exists$ = _.any(cursorDescription.selector, function (value, field) {                                           // 14
    if (field.substr(0, 1) === '$')                                                                                   // 15
      return true;                                                                                                    // 16
  });                                                                                                                 // 17
                                                                                                                      // 18
  if(exists$) {                                                                                                       // 19
    return {                                                                                                          // 20
      code: "070_$_NOT_SUPPORTED",                                                                                    // 21
      reason: "Meteor 0.7.0 supports only equal checks with oplog.",                                                  // 22
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 23
    }                                                                                                                 // 24
  };                                                                                                                  // 25
                                                                                                                      // 26
  var onlyScalers = _.all(cursorDescription.selector, function (value, field) {                                       // 27
    return typeof value === "string" ||                                                                               // 28
      typeof value === "number" ||                                                                                    // 29
      typeof value === "boolean" ||                                                                                   // 30
      value === null ||                                                                                               // 31
      value instanceof Meteor.Collection.ObjectID;                                                                    // 32
  });                                                                                                                 // 33
                                                                                                                      // 34
  if(!onlyScalers) {                                                                                                  // 35
    return {                                                                                                          // 36
      code: "070_ONLY_SCALERS",                                                                                       // 37
      reason: "Meteor 0.7.0 only supports scalers as comparators.",                                                   // 38
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 39
    }                                                                                                                 // 40
  }                                                                                                                   // 41
                                                                                                                      // 42
  return true;                                                                                                        // 43
};                                                                                                                    // 44
                                                                                                                      // 45
OplogCheck._071 = function(cursorDescription) {                                                                       // 46
  var options = cursorDescription.options;                                                                            // 47
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 48
  if (options.limit) {                                                                                                // 49
    return {                                                                                                          // 50
      code: "071_LIMIT_NOT_SUPPORTED",                                                                                // 51
      reason: "Meteor 0.7.1 does not support limit with oplog.",                                                      // 52
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 53
    }                                                                                                                 // 54
  };                                                                                                                  // 55
                                                                                                                      // 56
  return true;                                                                                                        // 57
};                                                                                                                    // 58
                                                                                                                      // 59
                                                                                                                      // 60
OplogCheck.env = function() {                                                                                         // 61
  if(!process.env.MONGO_OPLOG_URL) {                                                                                  // 62
    return {                                                                                                          // 63
      code: "NO_ENV",                                                                                                 // 64
      reason: "You haven't added oplog support for your the Meteor app.",                                             // 65
      solution: "Add oplog support for your Meteor app. see: http://goo.gl/Co1jJc"                                    // 66
    }                                                                                                                 // 67
  } else {                                                                                                            // 68
    return true;                                                                                                      // 69
  }                                                                                                                   // 70
};                                                                                                                    // 71
                                                                                                                      // 72
OplogCheck.disableOplog = function(cursorDescription) {                                                               // 73
  if(cursorDescription.options._disableOplog) {                                                                       // 74
    return {                                                                                                          // 75
      code: "DISABLE_OPLOG",                                                                                          // 76
      reason: "You've disable oplog for this cursor explicitly with _disableOplog option."                            // 77
    };                                                                                                                // 78
  } else {                                                                                                            // 79
    return true;                                                                                                      // 80
  }                                                                                                                   // 81
};                                                                                                                    // 82
                                                                                                                      // 83
// when creating Minimongo.Matcher object, if that's throws an exception                                              // 84
// meteor won't do the oplog support                                                                                  // 85
OplogCheck.miniMongoMatcher = function(cursorDescription) {                                                           // 86
  if(Minimongo.Matcher) {                                                                                             // 87
    try {                                                                                                             // 88
      var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                // 89
      return true;                                                                                                    // 90
    } catch(ex) {                                                                                                     // 91
      return {                                                                                                        // 92
        code: "MINIMONGO_MATCHER_ERROR",                                                                              // 93
        reason: "There's something wrong in your mongo query: " +  ex.message,                                        // 94
        solution: "Check your selector and change it accordingly."                                                    // 95
      };                                                                                                              // 96
    }                                                                                                                 // 97
  } else {                                                                                                            // 98
    // If there is no Minimongo.Matcher, we don't need to check this                                                  // 99
    return true;                                                                                                      // 100
  }                                                                                                                   // 101
};                                                                                                                    // 102
                                                                                                                      // 103
OplogCheck.miniMongoSorter = function(cursorDescription) {                                                            // 104
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 105
  if(Minimongo.Sorter && cursorDescription.options.sort) {                                                            // 106
    try {                                                                                                             // 107
      var sorter = new Minimongo.Sorter(                                                                              // 108
        cursorDescription.options.sort,                                                                               // 109
        { matcher: matcher }                                                                                          // 110
      );                                                                                                              // 111
      return true;                                                                                                    // 112
    } catch(ex) {                                                                                                     // 113
      return {                                                                                                        // 114
        code: "MINIMONGO_SORTER_ERROR",                                                                               // 115
        reason: "Some of your sort specifiers are not supported: " + ex.message,                                      // 116
        solution: "Check your sort specifiers and chage them accordingly."                                            // 117
      }                                                                                                               // 118
    }                                                                                                                 // 119
  } else {                                                                                                            // 120
    return true;                                                                                                      // 121
  }                                                                                                                   // 122
};                                                                                                                    // 123
                                                                                                                      // 124
OplogCheck.fields = function(cursorDescription) {                                                                     // 125
  var options = cursorDescription.options;                                                                            // 126
  if(options.fields) {                                                                                                // 127
    try {                                                                                                             // 128
      LocalCollection._checkSupportedProjection(options.fields);                                                      // 129
      return true;                                                                                                    // 130
    } catch (e) {                                                                                                     // 131
      if (e.name === "MinimongoError") {                                                                              // 132
        return {                                                                                                      // 133
          code: "NOT_SUPPORTED_FIELDS",                                                                               // 134
          reason: "Some of the field filters are not supported: " + e.message,                                        // 135
          solution: "Try removing those field filters."                                                               // 136
        };                                                                                                            // 137
      } else {                                                                                                        // 138
        throw e;                                                                                                      // 139
      }                                                                                                               // 140
    }                                                                                                                 // 141
  }                                                                                                                   // 142
  return true;                                                                                                        // 143
};                                                                                                                    // 144
                                                                                                                      // 145
OplogCheck.skip = function(cursorDescription) {                                                                       // 146
  if(cursorDescription.options.skip) {                                                                                // 147
    return {                                                                                                          // 148
      code: "SKIP_NOT_SUPPORTED",                                                                                     // 149
      reason: "Skip does not support with oplog.",                                                                    // 150
      solution: "Try to avoid using skip. Use range queries instead: http://goo.gl/b522Av"                            // 151
    };                                                                                                                // 152
  }                                                                                                                   // 153
                                                                                                                      // 154
  return true;                                                                                                        // 155
};                                                                                                                    // 156
                                                                                                                      // 157
OplogCheck.where = function(cursorDescription) {                                                                      // 158
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 159
  if(matcher.hasWhere()) {                                                                                            // 160
    return {                                                                                                          // 161
      code: "WHERE_NOT_SUPPORTED",                                                                                    // 162
      reason: "Meteor does not support queries with $where.",                                                         // 163
      solution: "Try to remove $where from your query. Use some alternative."                                         // 164
    }                                                                                                                 // 165
  };                                                                                                                  // 166
                                                                                                                      // 167
  return true;                                                                                                        // 168
};                                                                                                                    // 169
                                                                                                                      // 170
OplogCheck.geo = function(cursorDescription) {                                                                        // 171
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 172
                                                                                                                      // 173
  if(matcher.hasGeoQuery()) {                                                                                         // 174
    return {                                                                                                          // 175
      code: "GEO_NOT_SUPPORTED",                                                                                      // 176
      reason: "Meteor does not support queries with geo partial operators.",                                          // 177
      solution: "Try to remove geo partial operators from your query if possible."                                    // 178
    }                                                                                                                 // 179
  };                                                                                                                  // 180
                                                                                                                      // 181
  return true;                                                                                                        // 182
};                                                                                                                    // 183
                                                                                                                      // 184
OplogCheck.limitButNoSort = function(cursorDescription) {                                                             // 185
  var options = cursorDescription.options;                                                                            // 186
                                                                                                                      // 187
  if((options.limit && !options.sort)) {                                                                              // 188
    return {                                                                                                          // 189
      code: "LIMIT_NO_SORT",                                                                                          // 190
      reason: "Meteor oplog implementation does not support limit without a sort specifier.",                         // 191
      solution: "Try adding a sort specifier."                                                                        // 192
    }                                                                                                                 // 193
  };                                                                                                                  // 194
                                                                                                                      // 195
  return true;                                                                                                        // 196
};                                                                                                                    // 197
                                                                                                                      // 198
OplogCheck.olderVersion = function(cursorDescription, driver) {                                                       // 199
  if(driver && !driver.constructor.cursorSupported) {                                                                 // 200
    return {                                                                                                          // 201
      code: "OLDER_VERSION",                                                                                          // 202
      reason: "Your Meteor version does not have oplog support.",                                                     // 203
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 204
    };                                                                                                                // 205
  }                                                                                                                   // 206
  return true;                                                                                                        // 207
};                                                                                                                    // 208
                                                                                                                      // 209
OplogCheck.gitCheckout = function(cursorDescription, driver) {                                                        // 210
  if(!Meteor.release) {                                                                                               // 211
    return {                                                                                                          // 212
      code: "GIT_CHECKOUT",                                                                                           // 213
      reason: "Seems like your Meteor version is based on a Git checkout and it doesn't have the oplog support.",     // 214
      solution: "Try to upgrade your Meteor version."                                                                 // 215
    };                                                                                                                // 216
  }                                                                                                                   // 217
  return true;                                                                                                        // 218
};                                                                                                                    // 219
                                                                                                                      // 220
var preRunningMatchers = [                                                                                            // 221
  OplogCheck.env,                                                                                                     // 222
  OplogCheck.disableOplog,                                                                                            // 223
  OplogCheck.miniMongoMatcher                                                                                         // 224
];                                                                                                                    // 225
                                                                                                                      // 226
var globalMatchers = [                                                                                                // 227
  OplogCheck.fields,                                                                                                  // 228
  OplogCheck.skip,                                                                                                    // 229
  OplogCheck.where,                                                                                                   // 230
  OplogCheck.geo,                                                                                                     // 231
  OplogCheck.limitButNoSort,                                                                                          // 232
  OplogCheck.miniMongoSorter,                                                                                         // 233
  OplogCheck.olderVersion,                                                                                            // 234
  OplogCheck.gitCheckout                                                                                              // 235
];                                                                                                                    // 236
                                                                                                                      // 237
var versionMatchers = [                                                                                               // 238
  [/^0\.7\.1/, OplogCheck._071],                                                                                      // 239
  [/^0\.7\.0/, OplogCheck._070],                                                                                      // 240
];                                                                                                                    // 241
                                                                                                                      // 242
Kadira.checkWhyNoOplog = function(cursorDescription, observerDriver) {                                                // 243
  if(typeof Minimongo == 'undefined') {                                                                               // 244
    return {                                                                                                          // 245
      code: "CANNOT_DETECT",                                                                                          // 246
      reason: "You are running an older Meteor version and Kadira can't check oplog state.",                          // 247
      solution: "Try updating your Meteor app"                                                                        // 248
    }                                                                                                                 // 249
  }                                                                                                                   // 250
                                                                                                                      // 251
  var result = runMatchers(preRunningMatchers, cursorDescription, observerDriver);                                    // 252
  if(result !== true) {                                                                                               // 253
    return result;                                                                                                    // 254
  }                                                                                                                   // 255
                                                                                                                      // 256
  var meteorVersion = Meteor.release;                                                                                 // 257
  for(var lc=0; lc<versionMatchers.length; lc++) {                                                                    // 258
    var matcherInfo = versionMatchers[lc];                                                                            // 259
    if(matcherInfo[0].test(meteorVersion)) {                                                                          // 260
      var matched = matcherInfo[1](cursorDescription, observerDriver);                                                // 261
      if(matched !== true) {                                                                                          // 262
        return matched;                                                                                               // 263
      }                                                                                                               // 264
    }                                                                                                                 // 265
  }                                                                                                                   // 266
                                                                                                                      // 267
  result = runMatchers(globalMatchers, cursorDescription, observerDriver);                                            // 268
  if(result !== true) {                                                                                               // 269
    return result;                                                                                                    // 270
  }                                                                                                                   // 271
                                                                                                                      // 272
  return {                                                                                                            // 273
    code: "OPLOG_SUPPORTED",                                                                                          // 274
    reason: "This query should support oplog. It's weird if it's not.",                                               // 275
    solution: "Please contact Kadira support and let's discuss."                                                      // 276
  };                                                                                                                  // 277
};                                                                                                                    // 278
                                                                                                                      // 279
function runMatchers(matcherList, cursorDescription, observerDriver) {                                                // 280
  for(var lc=0; lc<matcherList.length; lc++) {                                                                        // 281
    var matcher = matcherList[lc];                                                                                    // 282
    var matched = matcher(cursorDescription, observerDriver);                                                         // 283
    if(matched !== true) {                                                                                            // 284
      return matched;                                                                                                 // 285
    }                                                                                                                 // 286
  }                                                                                                                   // 287
  return true;                                                                                                        // 288
}                                                                                                                     // 289
                                                                                                                      // 290
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/tracer/tracer.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fibers = Npm.require('fibers');                                                                                   // 1
var eventLogger = Npm.require('debug')('kadira:tracer');                                                              // 2
var REPITITIVE_EVENTS = {'db': true, 'http': true, 'email': true, 'wait': true, 'async': true};                       // 3
                                                                                                                      // 4
Tracer = function Tracer() {                                                                                          // 5
  this._filters = [];                                                                                                 // 6
};                                                                                                                    // 7
                                                                                                                      // 8
//In the future, we might wan't to track inner fiber events too.                                                      // 9
//Then we can't serialize the object with methods                                                                     // 10
//That's why we use this method of returning the data                                                                 // 11
Tracer.prototype.start = function(session, msg) {                                                                     // 12
  var traceInfo = {                                                                                                   // 13
    _id: session.id + "::" + msg.id,                                                                                  // 14
    session: session.id,                                                                                              // 15
    userId: session.userId,                                                                                           // 16
    id: msg.id,                                                                                                       // 17
    events: []                                                                                                        // 18
  };                                                                                                                  // 19
                                                                                                                      // 20
  if(msg.msg == 'method') {                                                                                           // 21
    traceInfo.type = 'method';                                                                                        // 22
    traceInfo.name = msg.method;                                                                                      // 23
  } else if(msg.msg == 'sub') {                                                                                       // 24
    traceInfo.type = 'sub';                                                                                           // 25
    traceInfo.name = msg.name;                                                                                        // 26
  } else {                                                                                                            // 27
    return null;                                                                                                      // 28
  }                                                                                                                   // 29
                                                                                                                      // 30
  return traceInfo;                                                                                                   // 31
};                                                                                                                    // 32
                                                                                                                      // 33
Tracer.prototype.event = function(traceInfo, type, data) {                                                            // 34
  // do not allow to proceed, if already completed or errored                                                         // 35
  var lastEvent = this.getLastEvent(traceInfo);                                                                       // 36
  if(lastEvent && ['complete', 'error'].indexOf(lastEvent.type) >= 0) {                                               // 37
    return false;                                                                                                     // 38
  }                                                                                                                   // 39
                                                                                                                      // 40
  //expecting a end event                                                                                             // 41
  var eventId = true;                                                                                                 // 42
                                                                                                                      // 43
  //specially handling for repitivive events like db, http                                                            // 44
  if(REPITITIVE_EVENTS[type]) {                                                                                       // 45
    //can't accept a new start event                                                                                  // 46
    if(traceInfo._lastEventId) {                                                                                      // 47
      return false;                                                                                                   // 48
    }                                                                                                                 // 49
    eventId = traceInfo._lastEventId = DefaultUniqueId.get();                                                         // 50
  }                                                                                                                   // 51
                                                                                                                      // 52
  var event = {type: type, at: Ntp._now()};                                                                           // 53
  if(data) {                                                                                                          // 54
    var info = _.pick(traceInfo, 'type', 'name')                                                                      // 55
    event.data = this._applyFilters(type, data, info, "start");;                                                      // 56
  }                                                                                                                   // 57
                                                                                                                      // 58
  traceInfo.events.push(event);                                                                                       // 59
                                                                                                                      // 60
  eventLogger("%s %s", type, traceInfo._id);                                                                          // 61
  return eventId;                                                                                                     // 62
};                                                                                                                    // 63
                                                                                                                      // 64
Tracer.prototype.eventEnd = function(traceInfo, eventId, data) {                                                      // 65
  if(traceInfo._lastEventId && traceInfo._lastEventId == eventId) {                                                   // 66
    var lastEvent = this.getLastEvent(traceInfo);                                                                     // 67
    var type = lastEvent.type + 'end';                                                                                // 68
    var event = {type: type, at: Ntp._now()};                                                                         // 69
    if(data) {                                                                                                        // 70
      var info = _.pick(traceInfo, 'type', 'name')                                                                    // 71
      event.data = this._applyFilters(type, data, info, "end");;                                                      // 72
    }                                                                                                                 // 73
    traceInfo.events.push(event);                                                                                     // 74
    eventLogger("%s %s", type, traceInfo._id);                                                                        // 75
                                                                                                                      // 76
    traceInfo._lastEventId = null;                                                                                    // 77
    return true;                                                                                                      // 78
  } else {                                                                                                            // 79
    return false;                                                                                                     // 80
  }                                                                                                                   // 81
};                                                                                                                    // 82
                                                                                                                      // 83
Tracer.prototype.getLastEvent = function(traceInfo) {                                                                 // 84
  return traceInfo.events[traceInfo.events.length -1]                                                                 // 85
};                                                                                                                    // 86
                                                                                                                      // 87
Tracer.prototype.endLastEvent = function(traceInfo) {                                                                 // 88
  var lastEvent = this.getLastEvent(traceInfo);                                                                       // 89
  if(lastEvent && !/end$/.test(lastEvent.type)) {                                                                     // 90
    traceInfo.events.push({                                                                                           // 91
      type: lastEvent.type + 'end',                                                                                   // 92
      at: Ntp._now()                                                                                                  // 93
    });                                                                                                               // 94
    return true;                                                                                                      // 95
  }                                                                                                                   // 96
  return false;                                                                                                       // 97
};                                                                                                                    // 98
                                                                                                                      // 99
Tracer.prototype.buildTrace = function(traceInfo) {                                                                   // 100
  var firstEvent = traceInfo.events[0];                                                                               // 101
  var lastEvent = traceInfo.events[traceInfo.events.length - 1];                                                      // 102
  var processedEvents = [];                                                                                           // 103
                                                                                                                      // 104
  if(firstEvent.type != 'start') {                                                                                    // 105
    console.warn('Kadira: trace is not started yet');                                                                 // 106
    return null;                                                                                                      // 107
  } else if(lastEvent.type != 'complete' && lastEvent.type != 'error') {                                              // 108
    //trace is not completed or errored yet                                                                           // 109
    console.warn('Kadira: trace is not completed or errored yet');                                                    // 110
    return null;                                                                                                      // 111
  } else {                                                                                                            // 112
    //build the metrics                                                                                               // 113
    traceInfo.errored = lastEvent.type == 'error';                                                                    // 114
    traceInfo.at = firstEvent.at;                                                                                     // 115
                                                                                                                      // 116
    var metrics = {                                                                                                   // 117
      total: lastEvent.at - firstEvent.at,                                                                            // 118
    };                                                                                                                // 119
                                                                                                                      // 120
    var totalNonCompute = 0;                                                                                          // 121
                                                                                                                      // 122
    firstEvent = ['start', 0];                                                                                        // 123
    if(traceInfo.events[0].data) firstEvent.push(traceInfo.events[0].data);                                           // 124
    processedEvents.push(firstEvent);                                                                                 // 125
                                                                                                                      // 126
    for(var lc=1; lc < traceInfo.events.length - 1; lc += 2) {                                                        // 127
      var prevEventEnd = traceInfo.events[lc-1];                                                                      // 128
      var startEvent = traceInfo.events[lc];                                                                          // 129
      var endEvent = traceInfo.events[lc+1];                                                                          // 130
      var computeTime = startEvent.at - prevEventEnd.at;                                                              // 131
      if(computeTime > 0) processedEvents.push(['compute', computeTime]);                                             // 132
      if(!endEvent) {                                                                                                 // 133
        console.error('Kadira: no end event for type: ', startEvent.type);                                            // 134
        return null;                                                                                                  // 135
      } else if(endEvent.type != startEvent.type + 'end') {                                                           // 136
        console.error('Kadira: endevent type mismatch: ', startEvent.type, endEvent.type, JSON.stringify(traceInfo));
        return null;                                                                                                  // 138
      } else {                                                                                                        // 139
        var elapsedTimeForEvent = endEvent.at - startEvent.at                                                         // 140
        var currentEvent = [startEvent.type, elapsedTimeForEvent];                                                    // 141
        currentEvent.push(_.extend({}, startEvent.data, endEvent.data));                                              // 142
        processedEvents.push(currentEvent);                                                                           // 143
        metrics[startEvent.type] = metrics[startEvent.type] || 0;                                                     // 144
        metrics[startEvent.type] += elapsedTimeForEvent;                                                              // 145
        totalNonCompute += elapsedTimeForEvent;                                                                       // 146
      }                                                                                                               // 147
    }                                                                                                                 // 148
                                                                                                                      // 149
    computeTime = lastEvent.at - traceInfo.events[traceInfo.events.length - 2];                                       // 150
    if(computeTime > 0) processedEvents.push(['compute', computeTime]);                                               // 151
                                                                                                                      // 152
    var lastEventData = [lastEvent.type, 0];                                                                          // 153
    if(lastEvent.data) lastEventData.push(lastEvent.data);                                                            // 154
    processedEvents.push(lastEventData);                                                                              // 155
                                                                                                                      // 156
    metrics.compute = metrics.total - totalNonCompute;                                                                // 157
    traceInfo.metrics = metrics;                                                                                      // 158
    traceInfo.events = processedEvents;                                                                               // 159
    traceInfo.isEventsProcessed = true;                                                                               // 160
    return traceInfo;                                                                                                 // 161
  }                                                                                                                   // 162
};                                                                                                                    // 163
                                                                                                                      // 164
Tracer.prototype.addFilter = function(filterFn) {                                                                     // 165
  this._filters.push(filterFn);                                                                                       // 166
};                                                                                                                    // 167
                                                                                                                      // 168
Tracer.prototype._applyFilters = function(eventType, data, info) {                                                    // 169
  this._filters.forEach(function(filterFn) {                                                                          // 170
    data = filterFn(eventType, _.clone(data), info);                                                                  // 171
  });                                                                                                                 // 172
                                                                                                                      // 173
  return data;                                                                                                        // 174
};                                                                                                                    // 175
                                                                                                                      // 176
Kadira.tracer = new Tracer();                                                                                         // 177
// need to expose Tracer to provide default set of filters                                                            // 178
Kadira.Tracer = Tracer;                                                                                               // 179
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/tracer/default_filters.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// strip sensitive data sent to kadia engine.                                                                         // 1
// possible to limit types by providing an array of types to strip                                                    // 2
// possible types are: "start", "db", "http", "email"                                                                 // 3
Tracer.stripSensitive = function stripSensitive(typesToStrip, receiverType, name) {                                   // 4
  typesToStrip =  typesToStrip || [];                                                                                 // 5
                                                                                                                      // 6
  var strippedTypes = {};                                                                                             // 7
  typesToStrip.forEach(function(type) {                                                                               // 8
    strippedTypes[type] = true;                                                                                       // 9
  });                                                                                                                 // 10
                                                                                                                      // 11
  return function (type, data, info) {                                                                                // 12
    if(typesToStrip.length > 0 && !strippedTypes[type])                                                               // 13
      return data;                                                                                                    // 14
                                                                                                                      // 15
    if(receiverType && receiverType != info.type)                                                                     // 16
      return data;                                                                                                    // 17
                                                                                                                      // 18
    if(name && name != info.name)                                                                                     // 19
      return data;                                                                                                    // 20
                                                                                                                      // 21
    if(type == "start") {                                                                                             // 22
      data.params = "[stripped]";                                                                                     // 23
    } else if(type == "db") {                                                                                         // 24
      data.selector = "[stripped]";                                                                                   // 25
    } else if(type == "http") {                                                                                       // 26
      data.url = "[stripped]";                                                                                        // 27
    } else if(type == "email") {                                                                                      // 28
      ["from", "to", "cc", "bcc", "replyTo"].forEach(function(item) {                                                 // 29
        if(data[item]) {                                                                                              // 30
          data[item] = "[stripped]";                                                                                  // 31
        }                                                                                                             // 32
      });                                                                                                             // 33
    }                                                                                                                 // 34
                                                                                                                      // 35
    return data;                                                                                                      // 36
  };                                                                                                                  // 37
};                                                                                                                    // 38
                                                                                                                      // 39
// strip selectors only from the given list of collection names                                                       // 40
Tracer.stripSelectors = function stripSelectors(collectionList, receiverType, name) {                                 // 41
  collectionList = collectionList || [];                                                                              // 42
                                                                                                                      // 43
  var collMap = {};                                                                                                   // 44
  collectionList.forEach(function(collName) {                                                                         // 45
    collMap[collName] = true;                                                                                         // 46
  });                                                                                                                 // 47
                                                                                                                      // 48
  return function(type, data, info) {                                                                                 // 49
    if(type != "db" || (data && !collMap[data.coll])) {                                                               // 50
      return data                                                                                                     // 51
    }                                                                                                                 // 52
                                                                                                                      // 53
    if(receiverType && receiverType != info.type)                                                                     // 54
      return data;                                                                                                    // 55
                                                                                                                      // 56
    if(name && name != info.name)                                                                                     // 57
      return data;                                                                                                    // 58
                                                                                                                      // 59
    data.selector = "[stripped]";                                                                                     // 60
    return data;                                                                                                      // 61
  };                                                                                                                  // 62
}                                                                                                                     // 63
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/tracer/tracer_store.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = Npm.require('debug')('kadira:ts');                                                                       // 1
                                                                                                                      // 2
TracerStore = function TracerStore(options) {                                                                         // 3
  options = options || {};                                                                                            // 4
                                                                                                                      // 5
  this.maxTotalPoints = options.maxTotalPoints || 30;                                                                 // 6
  this.interval = options.interval || 1000 * 60;                                                                      // 7
  this.archiveEvery = options.archiveEvery || this.maxTotalPoints / 6;                                                // 8
                                                                                                                      // 9
  //store max total on the past 30 minutes (or past 30 items)                                                         // 10
  this.maxTotals = {};                                                                                                // 11
  //store the max trace of the current interval                                                                       // 12
  this.currentMaxTrace = {};                                                                                          // 13
  //archive for the traces                                                                                            // 14
  this.traceArchive = [];                                                                                             // 15
                                                                                                                      // 16
  this.processedCnt = {};                                                                                             // 17
                                                                                                                      // 18
  //group errors by messages between an interval                                                                      // 19
  this.errorMap = {};                                                                                                 // 20
};                                                                                                                    // 21
                                                                                                                      // 22
TracerStore.prototype.addTrace = function(trace) {                                                                    // 23
  var kind = [trace.type, trace.name].join('::');                                                                     // 24
  if(!this.currentMaxTrace[kind]) {                                                                                   // 25
    this.currentMaxTrace[kind] = EJSON.clone(trace);                                                                  // 26
  } else if(this.currentMaxTrace[kind].metrics.total < trace.metrics.total) {                                         // 27
    this.currentMaxTrace[kind] = EJSON.clone(trace);                                                                  // 28
  } else if(trace.errored) {                                                                                          // 29
    this._handleErrors(trace);                                                                                        // 30
  }                                                                                                                   // 31
};                                                                                                                    // 32
                                                                                                                      // 33
TracerStore.prototype.collectTraces = function() {                                                                    // 34
  var traces = this.traceArchive;                                                                                     // 35
  this.traceArchive = [];                                                                                             // 36
                                                                                                                      // 37
  // convert at(timestamp) into the actual serverTime                                                                 // 38
  traces.forEach(function(trace) {                                                                                    // 39
    trace.at = Kadira.syncedDate.syncTime(trace.at);                                                                  // 40
  });                                                                                                                 // 41
  return traces;                                                                                                      // 42
};                                                                                                                    // 43
                                                                                                                      // 44
TracerStore.prototype.start = function() {                                                                            // 45
  this._timeoutHandler = setInterval(this.processTraces.bind(this), this.interval);                                   // 46
};                                                                                                                    // 47
                                                                                                                      // 48
TracerStore.prototype.stop = function() {                                                                             // 49
  if(this._timeoutHandler) {                                                                                          // 50
    clearInterval(this._timeoutHandler);                                                                              // 51
  }                                                                                                                   // 52
};                                                                                                                    // 53
                                                                                                                      // 54
TracerStore.prototype._handleErrors = function(trace) {                                                               // 55
  // sending error requests as it is                                                                                  // 56
  var lastEvent = trace.events[trace.events.length -1];                                                               // 57
  if(lastEvent && lastEvent[2]) {                                                                                     // 58
    var error = lastEvent[2].error;                                                                                   // 59
                                                                                                                      // 60
    // grouping errors occured (reset after processTraces)                                                            // 61
    var errorKey = [trace.type, trace.name, error.message].join("::");                                                // 62
    if(!this.errorMap[errorKey]) {                                                                                    // 63
      var erroredTrace = EJSON.clone(trace);                                                                          // 64
      this.errorMap[errorKey] = erroredTrace;                                                                         // 65
                                                                                                                      // 66
      this.traceArchive.push(erroredTrace);                                                                           // 67
    }                                                                                                                 // 68
  } else {                                                                                                            // 69
    logger('last events is not an error: ', JSON.stringify(trace.events));                                            // 70
  }                                                                                                                   // 71
};                                                                                                                    // 72
                                                                                                                      // 73
TracerStore.prototype.processTraces = function() {                                                                    // 74
  var self = this;                                                                                                    // 75
  var kinds = _.union(                                                                                                // 76
    _.keys(this.maxTotals),                                                                                           // 77
    _.keys(this.currentMaxTrace)                                                                                      // 78
  );                                                                                                                  // 79
                                                                                                                      // 80
  kinds.forEach(function(kind) {                                                                                      // 81
    self.processedCnt[kind] = self.processedCnt[kind] || 0;                                                           // 82
    var currentMaxTrace = self.currentMaxTrace[kind];                                                                 // 83
    var currentMaxTotal = currentMaxTrace? currentMaxTrace.metrics.total : 0;                                         // 84
                                                                                                                      // 85
    self.maxTotals[kind] = self.maxTotals[kind] || [];                                                                // 86
    //add the current maxPoint                                                                                        // 87
    self.maxTotals[kind].push(currentMaxTotal);                                                                       // 88
    var exceedingPoints = self.maxTotals[kind].length - self.maxTotalPoints;                                          // 89
    if(exceedingPoints > 0) {                                                                                         // 90
      self.maxTotals[kind].splice(0, exceedingPoints);                                                                // 91
    }                                                                                                                 // 92
                                                                                                                      // 93
    var archiveDefault = (self.processedCnt[kind] % self.archiveEvery) == 0;                                          // 94
    self.processedCnt[kind]++;                                                                                        // 95
                                                                                                                      // 96
    var canArchive = archiveDefault                                                                                   // 97
      || self._isTraceOutlier(kind, currentMaxTrace);                                                                 // 98
                                                                                                                      // 99
    if(canArchive && currentMaxTrace) {                                                                               // 100
      self.traceArchive.push(currentMaxTrace);                                                                        // 101
    }                                                                                                                 // 102
                                                                                                                      // 103
    //reset currentMaxTrace                                                                                           // 104
    self.currentMaxTrace[kind] = null;                                                                                // 105
  });                                                                                                                 // 106
                                                                                                                      // 107
  //reset the errorMap                                                                                                // 108
  self.errorMap = {};                                                                                                 // 109
};                                                                                                                    // 110
                                                                                                                      // 111
TracerStore.prototype._isTraceOutlier = function(kind, trace) {                                                       // 112
  if(trace) {                                                                                                         // 113
    var dataSet = this.maxTotals[kind];                                                                               // 114
    return this._isOutlier(dataSet, trace.metrics.total, 3);                                                          // 115
  } else {                                                                                                            // 116
    return false;                                                                                                     // 117
  }                                                                                                                   // 118
};                                                                                                                    // 119
                                                                                                                      // 120
/*                                                                                                                    // 121
  Data point must exists in the dataSet                                                                               // 122
*/                                                                                                                    // 123
TracerStore.prototype._isOutlier = function(dataSet, dataPoint, maxMadZ) {                                            // 124
  var median = this._getMedian(dataSet);                                                                              // 125
  var mad = this._calculateMad(dataSet, median);                                                                      // 126
  var madZ = this._funcMedianDeviation(median)(dataPoint) / mad;                                                      // 127
                                                                                                                      // 128
  return madZ > maxMadZ;                                                                                              // 129
};                                                                                                                    // 130
                                                                                                                      // 131
TracerStore.prototype._getMedian = function(dataSet) {                                                                // 132
  var sortedDataSet = _.clone(dataSet).sort(function(a, b) {                                                          // 133
    return a-b;                                                                                                       // 134
  });                                                                                                                 // 135
  return this._pickQuartile(sortedDataSet, 2);                                                                        // 136
};                                                                                                                    // 137
                                                                                                                      // 138
TracerStore.prototype._pickQuartile = function(dataSet, num) {                                                        // 139
  var pos = ((dataSet.length + 1) * num) / 4;                                                                         // 140
  if(pos % 1 == 0) {                                                                                                  // 141
    return dataSet[pos -1];                                                                                           // 142
  } else {                                                                                                            // 143
    pos = pos - (pos % 1);                                                                                            // 144
    return (dataSet[pos -1] + dataSet[pos])/2                                                                         // 145
  }                                                                                                                   // 146
};                                                                                                                    // 147
                                                                                                                      // 148
TracerStore.prototype._calculateMad = function(dataSet, median) {                                                     // 149
  var medianDeviations = _.map(dataSet, this._funcMedianDeviation(median));                                           // 150
  var mad = this._getMedian(medianDeviations);                                                                        // 151
                                                                                                                      // 152
  return mad;                                                                                                         // 153
};                                                                                                                    // 154
                                                                                                                      // 155
TracerStore.prototype._funcMedianDeviation = function(median) {                                                       // 156
  return function(x) {                                                                                                // 157
    return Math.abs(median - x);                                                                                      // 158
  };                                                                                                                  // 159
};                                                                                                                    // 160
                                                                                                                      // 161
TracerStore.prototype._getMean = function(dataPoints) {                                                               // 162
  if(dataPoints.length > 0) {                                                                                         // 163
    var total = 0;                                                                                                    // 164
    dataPoints.forEach(function(point) {                                                                              // 165
      total += point;                                                                                                 // 166
    });                                                                                                               // 167
    return total/dataPoints.length;                                                                                   // 168
  } else {                                                                                                            // 169
    return 0;                                                                                                         // 170
  }                                                                                                                   // 171
};                                                                                                                    // 172
                                                                                                                      // 173
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/models/0model.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
KadiraModel = function() {                                                                                            // 1
                                                                                                                      // 2
};                                                                                                                    // 3
                                                                                                                      // 4
KadiraModel.prototype._getDateId = function(timestamp) {                                                              // 5
  var remainder = timestamp % (1000 * 60);                                                                            // 6
  var dateId = timestamp - remainder;                                                                                 // 7
  return dateId;                                                                                                      // 8
};                                                                                                                    // 9
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/models/methods.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var METHOD_METRICS_FIELDS = ['wait', 'db', 'http', 'email', 'async', 'compute', 'total'];                             // 1
                                                                                                                      // 2
MethodsModel = function (metricsThreshold) {                                                                          // 3
  var self = this;                                                                                                    // 4
                                                                                                                      // 5
  this.methodMetricsByMinute = {};                                                                                    // 6
  this.errorMap = {};                                                                                                 // 7
                                                                                                                      // 8
  this._metricsThreshold = _.extend({                                                                                 // 9
    "wait": 100,                                                                                                      // 10
    "db": 100,                                                                                                        // 11
    "http": 1000,                                                                                                     // 12
    "email": 100,                                                                                                     // 13
    "async": 100,                                                                                                     // 14
    "compute": 100,                                                                                                   // 15
    "total": 200                                                                                                      // 16
  }, metricsThreshold || {});                                                                                         // 17
                                                                                                                      // 18
  //store max time elapsed methods for each method, event(metrics-field)                                              // 19
  this.maxEventTimesForMethods = {};                                                                                  // 20
                                                                                                                      // 21
  this.tracerStore = new TracerStore({                                                                                // 22
    interval: 1000 * 60, //process traces every minute                                                                // 23
    maxTotalPoints: 30, //for 30 minutes                                                                              // 24
    archiveEvery: 5 //always trace for every 5 minutes,                                                               // 25
  });                                                                                                                 // 26
                                                                                                                      // 27
  this.tracerStore.start();                                                                                           // 28
};                                                                                                                    // 29
                                                                                                                      // 30
_.extend(MethodsModel.prototype, KadiraModel.prototype);                                                              // 31
                                                                                                                      // 32
MethodsModel.prototype.processMethod = function(methodTrace) {                                                        // 33
  var dateId = this._getDateId(methodTrace.at);                                                                       // 34
                                                                                                                      // 35
  //append metrics to previous values                                                                                 // 36
  this._appendMetrics(dateId, methodTrace);                                                                           // 37
  if(methodTrace.errored) {                                                                                           // 38
    this.methodMetricsByMinute[dateId].methods[methodTrace.name].errors ++                                            // 39
  }                                                                                                                   // 40
                                                                                                                      // 41
  this.tracerStore.addTrace(methodTrace);                                                                             // 42
};                                                                                                                    // 43
                                                                                                                      // 44
MethodsModel.prototype._appendMetrics = function(id, methodTrace) {                                                   // 45
  //initialize meteric for this time interval                                                                         // 46
  if(!this.methodMetricsByMinute[id]) {                                                                               // 47
    this.methodMetricsByMinute[id] = {                                                                                // 48
      // startTime needs to be converted into serverTime before sending                                               // 49
      startTime: methodTrace.at,                                                                                      // 50
      methods: {}                                                                                                     // 51
    };                                                                                                                // 52
  }                                                                                                                   // 53
                                                                                                                      // 54
  var methods = this.methodMetricsByMinute[id].methods;                                                               // 55
                                                                                                                      // 56
  //initialize method                                                                                                 // 57
  if(!methods[methodTrace.name]) {                                                                                    // 58
    methods[methodTrace.name] = {                                                                                     // 59
      count: 0,                                                                                                       // 60
      errors: 0                                                                                                       // 61
    };                                                                                                                // 62
                                                                                                                      // 63
    METHOD_METRICS_FIELDS.forEach(function(field) {                                                                   // 64
      methods[methodTrace.name][field] = 0;                                                                           // 65
    });                                                                                                               // 66
  }                                                                                                                   // 67
                                                                                                                      // 68
  //merge                                                                                                             // 69
  METHOD_METRICS_FIELDS.forEach(function(field) {                                                                     // 70
    var value = methodTrace.metrics[field];                                                                           // 71
    if(value > 0) {                                                                                                   // 72
      methods[methodTrace.name][field] += value;                                                                      // 73
    }                                                                                                                 // 74
  });                                                                                                                 // 75
                                                                                                                      // 76
  methods[methodTrace.name].count++;                                                                                  // 77
  this.methodMetricsByMinute[id].endTime = methodTrace.metrics.at;                                                    // 78
};                                                                                                                    // 79
                                                                                                                      // 80
/*                                                                                                                    // 81
  There are two types of data                                                                                         // 82
                                                                                                                      // 83
  1. methodMetrics - metrics about the methods (for every 10 secs)                                                    // 84
  2. methodRequests - raw method request. normally max, min for every 1 min and errors always                         // 85
*/                                                                                                                    // 86
MethodsModel.prototype.buildPayload = function(buildDetailedInfo) {                                                   // 87
  var payload = {                                                                                                     // 88
    methodMetrics: [],                                                                                                // 89
    methodRequests: []                                                                                                // 90
  };                                                                                                                  // 91
                                                                                                                      // 92
  //handling metrics                                                                                                  // 93
  var methodMetricsByMinute = this.methodMetricsByMinute;                                                             // 94
  this.methodMetricsByMinute = {};                                                                                    // 95
                                                                                                                      // 96
  //create final paylod for methodMetrics                                                                             // 97
  for(var key in methodMetricsByMinute) {                                                                             // 98
    var methodMetrics = methodMetricsByMinute[key];                                                                   // 99
    // converting startTime into the actual serverTime                                                                // 100
    var startTime = methodMetrics.startTime;                                                                          // 101
    methodMetrics.startTime = Kadira.syncedDate.syncTime(startTime);                                                  // 102
                                                                                                                      // 103
    for(var methodName in methodMetrics.methods) {                                                                    // 104
      METHOD_METRICS_FIELDS.forEach(function(field) {                                                                 // 105
        methodMetrics.methods[methodName][field] /=                                                                   // 106
          methodMetrics.methods[methodName].count;                                                                    // 107
      });                                                                                                             // 108
    }                                                                                                                 // 109
                                                                                                                      // 110
    payload.methodMetrics.push(methodMetricsByMinute[key]);                                                           // 111
  }                                                                                                                   // 112
                                                                                                                      // 113
  //collect traces and send them with the payload                                                                     // 114
  payload.methodRequests = this.tracerStore.collectTraces();                                                          // 115
                                                                                                                      // 116
  return payload;                                                                                                     // 117
};                                                                                                                    // 118
                                                                                                                      // 119
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/models/pubsub.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = Npm.require('debug')('kadira:pubsub');                                                                   // 1
                                                                                                                      // 2
PubsubModel = function() {                                                                                            // 3
  this.metricsByMinute = {};                                                                                          // 4
  this.subscriptions = {};                                                                                            // 5
                                                                                                                      // 6
  this.tracerStore = new TracerStore({                                                                                // 7
    interval: 1000 * 60, //process traces every minute                                                                // 8
    maxTotalPoints: 30, //for 30 minutes                                                                              // 9
    archiveEvery: 5 //always trace for every 5 minutes,                                                               // 10
  });                                                                                                                 // 11
                                                                                                                      // 12
  this.tracerStore.start();                                                                                           // 13
}                                                                                                                     // 14
                                                                                                                      // 15
PubsubModel.prototype._trackSub = function(session, msg) {                                                            // 16
  logger('SUB:', session.id, msg.id, msg.name, msg.params);                                                           // 17
  var publication = this._getPublicationName(msg.name);                                                               // 18
  var subscriptionId = msg.id;                                                                                        // 19
  var timestamp = Ntp._now();                                                                                         // 20
  var metrics = this._getMetrics(timestamp, publication);                                                             // 21
                                                                                                                      // 22
  metrics.subs++;                                                                                                     // 23
  this.subscriptions[msg.id] = {                                                                                      // 24
    // We use localTime here, because when we used synedTime we might get                                             // 25
    // minus or more than we've expected                                                                              // 26
    //   (before serverTime diff changed overtime)                                                                    // 27
    startTime: timestamp,                                                                                             // 28
    publication: publication,                                                                                         // 29
    params: msg.params,                                                                                               // 30
    id: msg.id                                                                                                        // 31
  };                                                                                                                  // 32
                                                                                                                      // 33
  //set session startedTime                                                                                           // 34
  session._startTime = session._startTime || timestamp;                                                               // 35
};                                                                                                                    // 36
                                                                                                                      // 37
_.extend(PubsubModel.prototype, KadiraModel.prototype);                                                               // 38
                                                                                                                      // 39
PubsubModel.prototype._trackUnsub = function(session, sub) {                                                          // 40
  logger('UNSUB:', session.id, sub._subscriptionId);                                                                  // 41
  var publication = this._getPublicationName(sub._name);                                                              // 42
  var subscriptionId = sub._subscriptionId;                                                                           // 43
  var subscriptionState = this.subscriptions[subscriptionId];                                                         // 44
                                                                                                                      // 45
  var startTime = null;                                                                                               // 46
  //sometime, we don't have these states                                                                              // 47
  if(subscriptionState) {                                                                                             // 48
    startTime = subscriptionState.startTime;                                                                          // 49
  } else {                                                                                                            // 50
    //if this is null subscription, which is started automatically                                                    // 51
    //hence, we don't have a state                                                                                    // 52
    startTime = session._startTime;                                                                                   // 53
  }                                                                                                                   // 54
                                                                                                                      // 55
  //in case, we can't get the startTime                                                                               // 56
  if(startTime) {                                                                                                     // 57
    var timestamp = Ntp._now();                                                                                       // 58
    var metrics = this._getMetrics(timestamp, publication);                                                           // 59
    //track the count                                                                                                 // 60
    if(sub._name != null) {                                                                                           // 61
      // we can't track subs for `null` publications.                                                                 // 62
      // so we should not track unsubs too                                                                            // 63
      metrics.unsubs++;                                                                                               // 64
    }                                                                                                                 // 65
    //use the current date to get the lifeTime of the subscription                                                    // 66
    metrics.lifeTime += timestamp - startTime;                                                                        // 67
    //this is place we can clean the subscriptionState if exists                                                      // 68
    delete this.subscriptions[subscriptionId];                                                                        // 69
  }                                                                                                                   // 70
};                                                                                                                    // 71
                                                                                                                      // 72
PubsubModel.prototype._trackReady = function(session, sub, trace) {                                                   // 73
  logger('READY:', session.id, sub._subscriptionId);                                                                  // 74
  //use the current time to track the response time                                                                   // 75
  var publication = this._getPublicationName(sub._name);                                                              // 76
  var subscriptionId = sub._subscriptionId;                                                                           // 77
  var timestamp = Ntp._now();                                                                                         // 78
  var metrics = this._getMetrics(timestamp, publication);                                                             // 79
                                                                                                                      // 80
  var subscriptionState = this.subscriptions[subscriptionId];                                                         // 81
  if(subscriptionState && !subscriptionState.readyTracked) {                                                          // 82
    metrics.resTime += timestamp - subscriptionState.startTime;                                                       // 83
    subscriptionState.readyTracked = true;                                                                            // 84
  }                                                                                                                   // 85
                                                                                                                      // 86
  if(trace) {                                                                                                         // 87
    this.tracerStore.addTrace(trace);                                                                                 // 88
  }                                                                                                                   // 89
};                                                                                                                    // 90
                                                                                                                      // 91
PubsubModel.prototype._trackError = function(session, sub, trace) {                                                   // 92
  logger('ERROR:', session.id, sub._subscriptionId);                                                                  // 93
  //use the current time to track the response time                                                                   // 94
  var publication = this._getPublicationName(sub._name);                                                              // 95
  var subscriptionId = sub._subscriptionId;                                                                           // 96
  var timestamp = Ntp._now();                                                                                         // 97
  var metrics = this._getMetrics(timestamp, publication);                                                             // 98
                                                                                                                      // 99
  metrics.errors++;                                                                                                   // 100
                                                                                                                      // 101
  if(trace) {                                                                                                         // 102
    this.tracerStore.addTrace(trace);                                                                                 // 103
  }                                                                                                                   // 104
};                                                                                                                    // 105
                                                                                                                      // 106
PubsubModel.prototype._getMetrics = function(timestamp, publication) {                                                // 107
  var dateId = this._getDateId(timestamp);                                                                            // 108
                                                                                                                      // 109
  if(!this.metricsByMinute[dateId]) {                                                                                 // 110
    this.metricsByMinute[dateId] = {                                                                                  // 111
      // startTime needs to be convert to serverTime before sending to the server                                     // 112
      startTime: timestamp,                                                                                           // 113
      pubs: {}                                                                                                        // 114
    };                                                                                                                // 115
  }                                                                                                                   // 116
                                                                                                                      // 117
  if(!this.metricsByMinute[dateId].pubs[publication]) {                                                               // 118
    this.metricsByMinute[dateId].pubs[publication] = {                                                                // 119
      subs: 0,                                                                                                        // 120
      unsubs: 0,                                                                                                      // 121
      resTime: 0,                                                                                                     // 122
      activeSubs: 0,                                                                                                  // 123
      activeDocs: 0,                                                                                                  // 124
      lifeTime: 0,                                                                                                    // 125
      totalObservers: 0,                                                                                              // 126
      cachedObservers: 0,                                                                                             // 127
      createdObservers: 0,                                                                                            // 128
      deletedObservers: 0,                                                                                            // 129
      errors: 0,                                                                                                      // 130
      observerLifetime: 0,                                                                                            // 131
      polledDocuments: 0,                                                                                             // 132
      oplogUpdatedDocuments: 0,                                                                                       // 133
      oplogInsertedDocuments: 0,                                                                                      // 134
      oplogDeletedDocuments: 0,                                                                                       // 135
      initiallyAddedDocuments: 0,                                                                                     // 136
      liveAddedDocuments: 0,                                                                                          // 137
      liveChangedDocuments: 0,                                                                                        // 138
      liveRemovedDocuments: 0                                                                                         // 139
    };                                                                                                                // 140
  }                                                                                                                   // 141
                                                                                                                      // 142
  return this.metricsByMinute[dateId].pubs[publication];                                                              // 143
};                                                                                                                    // 144
                                                                                                                      // 145
PubsubModel.prototype._getPublicationName = function(name) {                                                          // 146
  return name || "null(autopublish)";                                                                                 // 147
};                                                                                                                    // 148
                                                                                                                      // 149
PubsubModel.prototype._getSubscriptionInfo = function() {                                                             // 150
  var self = this;                                                                                                    // 151
  var activeSubs = {};                                                                                                // 152
  var activeDocs = {};                                                                                                // 153
  var totalDocsSent = {};                                                                                             // 154
  var totalDataSent = {};                                                                                             // 155
  var totalObservers = {};                                                                                            // 156
  var cachedObservers = {};                                                                                           // 157
                                                                                                                      // 158
  for(var sessionId in Meteor.default_server.sessions) {                                                              // 159
    var session = Meteor.default_server.sessions[sessionId];                                                          // 160
    _.each(session._namedSubs, countSubData);                                                                         // 161
    _.each(session._universalSubs, countSubData);                                                                     // 162
  }                                                                                                                   // 163
                                                                                                                      // 164
  var avgObserverReuse = {};                                                                                          // 165
  _.each(totalObservers, function(value, publication) {                                                               // 166
    avgObserverReuse[publication] = cachedObservers[publication] / totalObservers[publication];                       // 167
  });                                                                                                                 // 168
                                                                                                                      // 169
  return {                                                                                                            // 170
    activeSubs: activeSubs,                                                                                           // 171
    activeDocs: activeDocs,                                                                                           // 172
    avgObserverReuse: avgObserverReuse                                                                                // 173
  };                                                                                                                  // 174
                                                                                                                      // 175
  function countSubData (sub) {                                                                                       // 176
    var publication = self._getPublicationName(sub._name);                                                            // 177
    countSubscriptions(sub, publication);                                                                             // 178
    countDocuments(sub, publication);                                                                                 // 179
    countObservers(sub, publication);                                                                                 // 180
  }                                                                                                                   // 181
                                                                                                                      // 182
  function countSubscriptions (sub, publication) {                                                                    // 183
    activeSubs[publication] = activeSubs[publication] || 0;                                                           // 184
    activeSubs[publication]++;                                                                                        // 185
  }                                                                                                                   // 186
                                                                                                                      // 187
  function countDocuments (sub, publication) {                                                                        // 188
    activeDocs[publication] = activeDocs[publication] || 0;                                                           // 189
    for(collectionName in sub._documents) {                                                                           // 190
      activeDocs[publication] += _.keys(sub._documents[collectionName]).length;                                       // 191
    }                                                                                                                 // 192
  }                                                                                                                   // 193
                                                                                                                      // 194
  function countObservers(sub, publication) {                                                                         // 195
    totalObservers[publication] = totalObservers[publication] || 0;                                                   // 196
    cachedObservers[publication] = cachedObservers[publication] || 0;                                                 // 197
                                                                                                                      // 198
    totalObservers[publication] += sub._totalObservers;                                                               // 199
    cachedObservers[publication] += sub._cachedObservers;                                                             // 200
  }                                                                                                                   // 201
}                                                                                                                     // 202
                                                                                                                      // 203
PubsubModel.prototype.buildPayload = function(buildDetailInfo) {                                                      // 204
  var metricsByMinute = this.metricsByMinute;                                                                         // 205
  this.metricsByMinute = {};                                                                                          // 206
                                                                                                                      // 207
  var payload = {                                                                                                     // 208
    pubMetrics: []                                                                                                    // 209
  };                                                                                                                  // 210
                                                                                                                      // 211
  var subscriptionData = this._getSubscriptionInfo();                                                                 // 212
  var activeSubs = subscriptionData.activeSubs;                                                                       // 213
  var activeDocs = subscriptionData.activeDocs;                                                                       // 214
  var avgObserverReuse = subscriptionData.avgObserverReuse;                                                           // 215
                                                                                                                      // 216
  //to the averaging                                                                                                  // 217
  for(var dateId in metricsByMinute) {                                                                                // 218
    var dateMetrics = metricsByMinute[dateId];                                                                        // 219
    // We need to convert startTime into actual serverTime                                                            // 220
    dateMetrics.startTime = Kadira.syncedDate.syncTime(dateMetrics.startTime);                                        // 221
                                                                                                                      // 222
    for(var publication in metricsByMinute[dateId].pubs) {                                                            // 223
      var singlePubMetrics = metricsByMinute[dateId].pubs[publication];                                               // 224
      // We only calculate resTime for new subscriptions                                                              // 225
      singlePubMetrics.resTime /= singlePubMetrics.subs;                                                              // 226
      singlePubMetrics.resTime = singlePubMetrics.resTime || 0;                                                       // 227
      // We only track lifeTime in the unsubs                                                                         // 228
      singlePubMetrics.lifeTime /= singlePubMetrics.unsubs;                                                           // 229
      singlePubMetrics.lifeTime = singlePubMetrics.lifeTime || 0;                                                     // 230
                                                                                                                      // 231
      // Count the average for observer lifetime                                                                      // 232
      if(singlePubMetrics.deletedObservers > 0) {                                                                     // 233
        singlePubMetrics.observerLifetime /= singlePubMetrics.deletedObservers;                                       // 234
      }                                                                                                               // 235
                                                                                                                      // 236
      // If there are two ore more dateIds, we will be using the currentCount for all of them.                        // 237
      // We can come up with a better solution later on.                                                              // 238
      singlePubMetrics.activeSubs = activeSubs[publication] || 0;                                                     // 239
      singlePubMetrics.activeDocs = activeDocs[publication] || 0;                                                     // 240
      singlePubMetrics.avgObserverReuse = avgObserverReuse[publication] || 0;                                         // 241
    }                                                                                                                 // 242
                                                                                                                      // 243
    payload.pubMetrics.push(metricsByMinute[dateId]);                                                                 // 244
  }                                                                                                                   // 245
                                                                                                                      // 246
  //collect traces and send them with the payload                                                                     // 247
  payload.pubRequests = this.tracerStore.collectTraces();                                                             // 248
                                                                                                                      // 249
  return payload;                                                                                                     // 250
};                                                                                                                    // 251
                                                                                                                      // 252
PubsubModel.prototype.incrementHandleCount = function(trace, isCached) {                                              // 253
  var publicationName = trace.name;                                                                                   // 254
  var timestamp = Ntp._now();                                                                                         // 255
  var publication = this._getMetrics(timestamp, publicationName);                                                     // 256
                                                                                                                      // 257
  var session = Meteor.default_server.sessions[trace.session];                                                        // 258
  if(session) {                                                                                                       // 259
    var sub = session._namedSubs[trace.id];                                                                           // 260
    if(sub) {                                                                                                         // 261
      sub._totalObservers = sub._totalObservers || 0;                                                                 // 262
      sub._cachedObservers = sub._cachedObservers || 0;                                                               // 263
    }                                                                                                                 // 264
  }                                                                                                                   // 265
  // not sure, we need to do this? But I don't need to break the however                                              // 266
  sub = sub || {_totalObservers:0 , _cachedObservers: 0};                                                             // 267
                                                                                                                      // 268
  publication.totalObservers++;                                                                                       // 269
  sub._totalObservers++;                                                                                              // 270
  if(isCached) {                                                                                                      // 271
    publication.cachedObservers++;                                                                                    // 272
    sub._cachedObservers++;                                                                                           // 273
  }                                                                                                                   // 274
}                                                                                                                     // 275
                                                                                                                      // 276
PubsubModel.prototype.trackCreatedObserver = function(info) {                                                         // 277
  var timestamp = Ntp._now();                                                                                         // 278
  var publication = this._getMetrics(timestamp, info.name);                                                           // 279
  publication.createdObservers++;                                                                                     // 280
}                                                                                                                     // 281
                                                                                                                      // 282
PubsubModel.prototype.trackDeletedObserver = function(info) {                                                         // 283
  var timestamp = Ntp._now();                                                                                         // 284
  var publication = this._getMetrics(timestamp, info.name);                                                           // 285
  publication.deletedObservers++;                                                                                     // 286
  publication.observerLifetime += (new Date()).getTime() - info.startTime;                                            // 287
}                                                                                                                     // 288
                                                                                                                      // 289
PubsubModel.prototype.trackDocumentChanges = function(info, op) {                                                     // 290
  // It's possibel that info to be null                                                                               // 291
  // Specially when getting changes at the very begining.                                                             // 292
  // This may be false, but nice to have a check                                                                      // 293
  if(!info) {                                                                                                         // 294
    return                                                                                                            // 295
  }                                                                                                                   // 296
                                                                                                                      // 297
  var timestamp = Ntp._now();                                                                                         // 298
  var publication = this._getMetrics(timestamp, info.name);                                                           // 299
  if(op.op === "d") {                                                                                                 // 300
    publication.oplogDeletedDocuments++;                                                                              // 301
  } else if(op.op === "i") {                                                                                          // 302
    publication.oplogInsertedDocuments++;                                                                             // 303
  } else if(op.op === "u") {                                                                                          // 304
    publication.oplogUpdatedDocuments++;                                                                              // 305
  }                                                                                                                   // 306
}                                                                                                                     // 307
                                                                                                                      // 308
PubsubModel.prototype.trackPolledDocuments = function(info, count) {                                                  // 309
  var timestamp = Ntp._now();                                                                                         // 310
  var publication = this._getMetrics(timestamp, info.name);                                                           // 311
  publication.polledDocuments += count;                                                                               // 312
}                                                                                                                     // 313
                                                                                                                      // 314
PubsubModel.prototype.trackLiveUpdates = function(info, type, count) {                                                // 315
  var timestamp = Ntp._now();                                                                                         // 316
  var publication = this._getMetrics(timestamp, info.name);                                                           // 317
                                                                                                                      // 318
  if(type === "_addPublished") {                                                                                      // 319
    publication.liveAddedDocuments += count;                                                                          // 320
  } else if(type === "_removePublished") {                                                                            // 321
    publication.liveRemovedDocuments += count;                                                                        // 322
  } else if(type === "_changePublished") {                                                                            // 323
    publication.liveChangedDocuments += count;                                                                        // 324
  } else if(type === "_initialAdds") {                                                                                // 325
    publication.initiallyAddedDocuments += count;                                                                     // 326
  } else {                                                                                                            // 327
    throw new Error("Kadira: Unknown live update type");                                                              // 328
  }                                                                                                                   // 329
}                                                                                                                     // 330
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/models/system.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var os = Npm.require('os');                                                                                           // 1
var usage = Npm.require('pidusage');                                                                                  // 2
var EventLoopMonitor = Npm.require('evloop-monitor');                                                                 // 3
                                                                                                                      // 4
SystemModel = function () {                                                                                           // 5
  var self = this;                                                                                                    // 6
  this.startTime = Ntp._now();                                                                                        // 7
  this.newSessions = 0;                                                                                               // 8
  this.sessionTimeout = 1000 * 60 * 30; //30 min                                                                      // 9
                                                                                                                      // 10
  this.usageLookup = Kadira._wrapAsync(usage.stat.bind(usage));                                                       // 11
  this.evloopMonitor = new EventLoopMonitor(200);                                                                     // 12
  this.evloopMonitor.start();                                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(SystemModel.prototype, KadiraModel.prototype);                                                               // 16
                                                                                                                      // 17
SystemModel.prototype.buildPayload = function() {                                                                     // 18
  var metrics = {};                                                                                                   // 19
  var now = Ntp._now();                                                                                               // 20
  metrics.startTime = Kadira.syncedDate.syncTime(this.startTime);                                                     // 21
  metrics.endTime = Kadira.syncedDate.syncTime(now);                                                                  // 22
                                                                                                                      // 23
  metrics.sessions = _.keys(Meteor.default_server.sessions).length;                                                   // 24
  metrics.memory = process.memoryUsage().rss / (1024*1024);                                                           // 25
  metrics.newSessions = this.newSessions;                                                                             // 26
  this.newSessions = 0;                                                                                               // 27
                                                                                                                      // 28
  var usage = this.getUsage();                                                                                        // 29
  metrics.pcpu = usage.cpu;                                                                                           // 30
  if(usage.cpuInfo) {                                                                                                 // 31
    metrics.cputime = usage.cpuInfo.cpuTime;                                                                          // 32
    metrics.pcpuUser = usage.cpuInfo.pcpuUser;                                                                        // 33
    metrics.pcpuSystem = usage.cpuInfo.pcpuSystem;                                                                    // 34
  }                                                                                                                   // 35
                                                                                                                      // 36
  // track eventloop blockness                                                                                        // 37
  metrics.pctEvloopBlock = this.evloopMonitor.status().pctBlock;                                                      // 38
                                                                                                                      // 39
  this.startTime = now;                                                                                               // 40
  return {systemMetrics: [metrics]};                                                                                  // 41
};                                                                                                                    // 42
                                                                                                                      // 43
SystemModel.prototype.getUsage = function() {                                                                         // 44
  return this.usageLookup(process.pid) || {};                                                                         // 45
};                                                                                                                    // 46
                                                                                                                      // 47
SystemModel.prototype.handleSessionActivity = function(msg, session) {                                                // 48
  if(msg.msg === 'connect' && !msg.session) {                                                                         // 49
    this.countNewSession(session);                                                                                    // 50
  } else if(['sub', 'method'].indexOf(msg.msg) != -1) {                                                               // 51
    if(!this.isSessionActive(session)) {                                                                              // 52
      this.countNewSession(session);                                                                                  // 53
    }                                                                                                                 // 54
  }                                                                                                                   // 55
  session._activeAt = Date.now();                                                                                     // 56
}                                                                                                                     // 57
                                                                                                                      // 58
SystemModel.prototype.countNewSession = function(session) {                                                           // 59
  if(!isLocalAddress(session.socket)) {                                                                               // 60
    this.newSessions++;                                                                                               // 61
  }                                                                                                                   // 62
}                                                                                                                     // 63
                                                                                                                      // 64
SystemModel.prototype.isSessionActive = function(session) {                                                           // 65
  var inactiveTime = Date.now() - session._activeAt;                                                                  // 66
  return inactiveTime < this.sessionTimeout;                                                                          // 67
}                                                                                                                     // 68
                                                                                                                      // 69
// ------------------------------------------------------------------------- //                                       // 70
                                                                                                                      // 71
// http://regex101.com/r/iF3yR3/2                                                                                     // 72
var isLocalHostRegex = /^(?:.*\.local|localhost)(?:\:\d+)?|127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/;
                                                                                                                      // 74
// http://regex101.com/r/hM5gD8/1                                                                                     // 75
var isLocalAddressRegex = /^127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/;
                                                                                                                      // 77
function isLocalAddress (socket) {                                                                                    // 78
  var host = socket.headers['host'];                                                                                  // 79
  if(host) return isLocalHostRegex.test(host);                                                                        // 80
  var address = socket.headers['x-forwarded-for'] || socket.remoteAddress;                                            // 81
  if(address) return isLocalAddressRegex.test(address);                                                               // 82
}                                                                                                                     // 83
                                                                                                                      // 84
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/models/errors.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
ErrorModel = function (appId) {                                                                                       // 1
  BaseErrorModel.call(this);                                                                                          // 2
  var self = this;                                                                                                    // 3
  this.appId = appId;                                                                                                 // 4
  this.errors = {};                                                                                                   // 5
  this.startTime = Date.now();                                                                                        // 6
  this.maxErrors = 10;                                                                                                // 7
}                                                                                                                     // 8
                                                                                                                      // 9
_.extend(ErrorModel.prototype, KadiraModel.prototype);                                                                // 10
_.extend(ErrorModel.prototype, BaseErrorModel.prototype);                                                             // 11
                                                                                                                      // 12
ErrorModel.prototype.buildPayload = function() {                                                                      // 13
  var metrics = _.values(this.errors);                                                                                // 14
  this.startTime = Ntp._now();                                                                                        // 15
                                                                                                                      // 16
  _.each(metrics, function (metric) {                                                                                 // 17
    metric.startTime = Kadira.syncedDate.syncTime(metric.startTime)                                                   // 18
  });                                                                                                                 // 19
                                                                                                                      // 20
  this.errors = {};                                                                                                   // 21
  return {errors: metrics};                                                                                           // 22
};                                                                                                                    // 23
                                                                                                                      // 24
ErrorModel.prototype.errorCount = function () {                                                                       // 25
  return _.values(this.errors).length;                                                                                // 26
};                                                                                                                    // 27
                                                                                                                      // 28
ErrorModel.prototype.trackError = function(ex, trace) {                                                               // 29
  var key = trace.type + ':' + ex.message;                                                                            // 30
  if(this.errors[key]) {                                                                                              // 31
    this.errors[key].count++;                                                                                         // 32
  } else if (this.errorCount() < this.maxErrors) {                                                                    // 33
    var errorDef = this._formatError(ex, trace);                                                                      // 34
    if(this.applyFilters(errorDef.type, errorDef.name, ex, errorDef.subType)) {                                       // 35
      this.errors[key] = this._formatError(ex, trace);                                                                // 36
    }                                                                                                                 // 37
  }                                                                                                                   // 38
};                                                                                                                    // 39
                                                                                                                      // 40
ErrorModel.prototype._formatError = function(ex, trace) {                                                             // 41
  var time = Date.now();                                                                                              // 42
  var stack = ex.stack;                                                                                               // 43
                                                                                                                      // 44
  // to get Meteor's Error details                                                                                    // 45
  if(ex.details) {                                                                                                    // 46
    stack = "Details: " + ex.details + "\r\n" + stack;                                                                // 47
  }                                                                                                                   // 48
                                                                                                                      // 49
  // Update trace's error event with the next stack                                                                   // 50
  var errorEvent = trace.events && trace.events[trace.events.length -1];                                              // 51
  var errorObject = errorEvent && errorEvent[2] && errorEvent[2].error;                                               // 52
                                                                                                                      // 53
  if(errorObject) {                                                                                                   // 54
    errorObject.stack = stack;                                                                                        // 55
  }                                                                                                                   // 56
                                                                                                                      // 57
  return {                                                                                                            // 58
    appId: this.appId,                                                                                                // 59
    name: ex.message,                                                                                                 // 60
    type: trace.type,                                                                                                 // 61
    startTime: time,                                                                                                  // 62
    subType: trace.subType || trace.name,                                                                             // 63
    trace: trace,                                                                                                     // 64
    stacks: [{stack: stack}],                                                                                         // 65
    count: 1,                                                                                                         // 66
  }                                                                                                                   // 67
};                                                                                                                    // 68
                                                                                                                      // 69
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/kadira.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var hostname = Npm.require('os').hostname();                                                                          // 1
var logger = Npm.require('debug')('kadira:apm');                                                                      // 2
var Fibers = Npm.require('fibers');                                                                                   // 3
                                                                                                                      // 4
var KadiraCore = Npm.require('kadira-core').Kadira;                                                                   // 5
                                                                                                                      // 6
Kadira.models = {};                                                                                                   // 7
Kadira.options = {};                                                                                                  // 8
Kadira.env = {                                                                                                        // 9
  currentSub: null, // keep current subscription inside ddp                                                           // 10
  kadiraInfo: new Meteor.EnvironmentVariable(),                                                                       // 11
};                                                                                                                    // 12
Kadira.waitTimeBuilder = new WaitTimeBuilder();                                                                       // 13
Kadira.errors = [];                                                                                                   // 14
Kadira.errors.addFilter = Kadira.errors.push.bind(Kadira.errors);                                                     // 15
                                                                                                                      // 16
Kadira.models.methods = new MethodsModel();                                                                           // 17
Kadira.models.pubsub = new PubsubModel();                                                                             // 18
Kadira.models.system = new SystemModel();                                                                             // 19
                                                                                                                      // 20
                                                                                                                      // 21
Kadira.connect = function(appId, appSecret, options) {                                                                // 22
  options = options || {};                                                                                            // 23
  options.appId = appId;                                                                                              // 24
  options.appSecret = appSecret;                                                                                      // 25
  options.payloadTimeout = options.payloadTimeout || 1000 * 20;                                                       // 26
  options.endpoint = options.endpoint || "https://enginex.kadira.io";                                                 // 27
  options.clientEngineSyncDelay = options.clientEngineSyncDelay || 10000;                                             // 28
  options.thresholds = options.thresholds || {};                                                                      // 29
  options.isHostNameSet = !!options.hostname;                                                                         // 30
  options.hostname = options.hostname || hostname;                                                                    // 31
  options.proxy = options.proxy || null;                                                                              // 32
                                                                                                                      // 33
  // remove trailing slash from endpoint url (if any)                                                                 // 34
  if(_.last(options.endpoint) === '/') {                                                                              // 35
    options.endpoint = options.endpoint.substr(0, options.endpoint.length - 1);                                       // 36
  }                                                                                                                   // 37
                                                                                                                      // 38
  // error tracking is enabled by default                                                                             // 39
  if(options.enableErrorTracking === undefined) {                                                                     // 40
    options.enableErrorTracking = true;                                                                               // 41
  }                                                                                                                   // 42
                                                                                                                      // 43
  Kadira.options = options;                                                                                           // 44
  Kadira.options.authHeaders = {                                                                                      // 45
    'KADIRA-APP-ID': Kadira.options.appId,                                                                            // 46
    'KADIRA-APP-SECRET': Kadira.options.appSecret                                                                     // 47
  };                                                                                                                  // 48
                                                                                                                      // 49
  Kadira.syncedDate = new Ntp(options.endpoint);                                                                      // 50
  Kadira.syncedDate.sync();                                                                                           // 51
  Kadira.models.error = new ErrorModel(appId);                                                                        // 52
                                                                                                                      // 53
  // handle pre-added filters                                                                                         // 54
  var addFilterFn = Kadira.models.error.addFilter.bind(Kadira.models.error);                                          // 55
  Kadira.errors.forEach(addFilterFn);                                                                                 // 56
  Kadira.errors = Kadira.models.error;                                                                                // 57
                                                                                                                      // 58
  // setting runtime info, which will be sent to kadira                                                               // 59
  __meteor_runtime_config__.kadira = {                                                                                // 60
    appId: appId,                                                                                                     // 61
    endpoint: options.endpoint,                                                                                       // 62
    clientEngineSyncDelay: options.clientEngineSyncDelay,                                                             // 63
  };                                                                                                                  // 64
                                                                                                                      // 65
  // send hostname to client only is users sets a custom hostname                                                     // 66
  if(options.isHostNameSet) {                                                                                         // 67
    __meteor_runtime_config__.kadira.hostname = options.hostname;                                                     // 68
  }                                                                                                                   // 69
                                                                                                                      // 70
  if(options.enableErrorTracking) {                                                                                   // 71
    Kadira.enableErrorTracking();                                                                                     // 72
  } else {                                                                                                            // 73
    Kadira.disableErrorTracking();                                                                                    // 74
  }                                                                                                                   // 75
                                                                                                                      // 76
  if(appId && appSecret) {                                                                                            // 77
    options.appId = options.appId.trim();                                                                             // 78
    options.appSecret = options.appSecret.trim();                                                                     // 79
                                                                                                                      // 80
    Kadira.coreApi = new KadiraCore({                                                                                 // 81
      appId: options.appId,                                                                                           // 82
      appSecret: options.appSecret,                                                                                   // 83
      endpoint: options.endpoint,                                                                                     // 84
      hostname: options.hostname                                                                                      // 85
    });                                                                                                               // 86
                                                                                                                      // 87
    Kadira.coreApi._checkAuth()                                                                                       // 88
      .then(function() {                                                                                              // 89
        logger('connected to app: ', appId);                                                                          // 90
        console.log('Kadira: Successfully connected');                                                                // 91
        Kadira._sendAppStats();                                                                                       // 92
        Kadira._schedulePayloadSend();                                                                                // 93
      })                                                                                                              // 94
      .catch(function(err) {                                                                                          // 95
        console.log('Kadira: authentication failed - check your appId & appSecret')                                   // 96
      });                                                                                                             // 97
  } else {                                                                                                            // 98
    throw new Error('Kadira: required appId and appSecret');                                                          // 99
  }                                                                                                                   // 100
                                                                                                                      // 101
  // start tracking errors                                                                                            // 102
  Meteor.startup(function () {                                                                                        // 103
    TrackUncaughtExceptions();                                                                                        // 104
    TrackMeteorDebug();                                                                                               // 105
  })                                                                                                                  // 106
                                                                                                                      // 107
  Meteor.publish(null, function () {                                                                                  // 108
    var options = __meteor_runtime_config__.kadira;                                                                   // 109
    this.added('kadira_settings', Random.id(), options);                                                              // 110
    this.ready();                                                                                                     // 111
  });                                                                                                                 // 112
                                                                                                                      // 113
  // notify we've connected                                                                                           // 114
  Kadira.connected = true;                                                                                            // 115
};                                                                                                                    // 116
                                                                                                                      // 117
//track how many times we've sent the data (once per minute)                                                          // 118
Kadira._buildPayload = function () {                                                                                  // 119
  var payload = {host: Kadira.options.hostname};                                                                      // 120
  var buildDetailedInfo = Kadira._isDetailedInfo();                                                                   // 121
  _.extend(payload, Kadira.models.methods.buildPayload(buildDetailedInfo));                                           // 122
  _.extend(payload, Kadira.models.pubsub.buildPayload(buildDetailedInfo));                                            // 123
  _.extend(payload, Kadira.models.system.buildPayload());                                                             // 124
  if(Kadira.options.enableErrorTracking) {                                                                            // 125
    _.extend(payload, Kadira.models.error.buildPayload());                                                            // 126
  }                                                                                                                   // 127
                                                                                                                      // 128
  return payload;                                                                                                     // 129
}                                                                                                                     // 130
                                                                                                                      // 131
Kadira._countDataSent = 0;                                                                                            // 132
Kadira._detailInfoSentInterval = Math.ceil((1000*60) / Kadira.options.payloadTimeout);                                // 133
Kadira._isDetailedInfo = function () {                                                                                // 134
  return (Kadira._countDataSent++ % Kadira._detailInfoSentInterval) == 0;                                             // 135
}                                                                                                                     // 136
                                                                                                                      // 137
Kadira._sendAppStats = function () {                                                                                  // 138
  var appStats = {};                                                                                                  // 139
  appStats.release = Meteor.release;                                                                                  // 140
  appStats.protocolVersion = '1.0.0';                                                                                 // 141
  appStats.packageVersions = [];                                                                                      // 142
  appStats.appVersions = {                                                                                            // 143
    webapp: __meteor_runtime_config__['autoupdateVersion'],                                                           // 144
    refreshable: __meteor_runtime_config__['autoupdateVersionRefreshable'],                                           // 145
    cordova: __meteor_runtime_config__['autoupdateVersionCordova']                                                    // 146
  }                                                                                                                   // 147
                                                                                                                      // 148
  // TODO get version number for installed packages                                                                   // 149
  _.each(Package, function (v, name) {                                                                                // 150
    appStats.packageVersions.push({name: name, version: null});                                                       // 151
  });                                                                                                                 // 152
                                                                                                                      // 153
  Kadira.coreApi.sendData({                                                                                           // 154
    startTime: new Date(),                                                                                            // 155
    appStats: appStats                                                                                                // 156
  }).catch(function(err) {                                                                                            // 157
    console.error('Kadira Error on sending appStats:', err.message);                                                  // 158
  });                                                                                                                 // 159
}                                                                                                                     // 160
                                                                                                                      // 161
Kadira._schedulePayloadSend = function () {                                                                           // 162
  setTimeout(function () {                                                                                            // 163
    Kadira._sendPayload(Kadira._schedulePayloadSend);                                                                 // 164
  }, Kadira.options.payloadTimeout);                                                                                  // 165
}                                                                                                                     // 166
                                                                                                                      // 167
Kadira._sendPayload = function (callback) {                                                                           // 168
  new Fibers(function() {                                                                                             // 169
    var payload = Kadira._buildPayload();                                                                             // 170
    Kadira.coreApi.sendData(payload)                                                                                  // 171
    .then(callback)                                                                                                   // 172
    .catch(function(err) {                                                                                            // 173
      console.log('Kadira Error:', err.message);                                                                      // 174
      callback();                                                                                                     // 175
    });                                                                                                               // 176
  }).run();                                                                                                           // 177
}                                                                                                                     // 178
                                                                                                                      // 179
// this return the __kadiraInfo from the current Fiber by default                                                     // 180
// if called with 2nd argument as true, it will get the kadira info from                                              // 181
// Meteor.EnvironmentVariable                                                                                         // 182
//                                                                                                                    // 183
// WARNNING: returned info object is the reference object.                                                            // 184
//  Changing it might cause issues when building traces. So use with care                                             // 185
Kadira._getInfo = function(currentFiber, useEnvironmentVariable) {                                                    // 186
  currentFiber = currentFiber || Fibers.current;                                                                      // 187
  if(currentFiber) {                                                                                                  // 188
    if(useEnvironmentVariable) {                                                                                      // 189
      return Kadira.env.kadiraInfo.get();                                                                             // 190
    }                                                                                                                 // 191
    return currentFiber.__kadiraInfo;                                                                                 // 192
  }                                                                                                                   // 193
};                                                                                                                    // 194
                                                                                                                      // 195
// this does not clone the info object. So, use with care                                                             // 196
Kadira._setInfo = function(info) {                                                                                    // 197
  Fibers.current.__kadiraInfo = info;                                                                                 // 198
};                                                                                                                    // 199
                                                                                                                      // 200
Kadira.enableErrorTracking = function () {                                                                            // 201
  __meteor_runtime_config__.kadira.enableErrorTracking = true;                                                        // 202
  Kadira.options.enableErrorTracking = true;                                                                          // 203
};                                                                                                                    // 204
                                                                                                                      // 205
Kadira.disableErrorTracking = function () {                                                                           // 206
  __meteor_runtime_config__.kadira.enableErrorTracking = false;                                                       // 207
  Kadira.options.enableErrorTracking = false;                                                                         // 208
};                                                                                                                    // 209
                                                                                                                      // 210
Kadira.trackError = function (type, message, options) {                                                               // 211
  if(Kadira.options.enableErrorTracking && type && message) {                                                         // 212
    options = options || {};                                                                                          // 213
    options.subType = options.subType || 'server';                                                                    // 214
    options.stacks = options.stacks || '';                                                                            // 215
    var error = {message: message, stack: options.stacks};                                                            // 216
    var trace = {                                                                                                     // 217
      type: type,                                                                                                     // 218
      subType: options.subType,                                                                                       // 219
      name: message,                                                                                                  // 220
      errored: true,                                                                                                  // 221
      at: Kadira.syncedDate.getTime(),                                                                                // 222
      events: [['start', 0, {}], ['error', 0, {error: error}]],                                                       // 223
      metrics: {total: 0}                                                                                             // 224
    };                                                                                                                // 225
    Kadira.models.error.trackError(error, trace);                                                                     // 226
  }                                                                                                                   // 227
}                                                                                                                     // 228
                                                                                                                      // 229
Kadira.ignoreErrorTracking = function (err) {                                                                         // 230
  err._skipKadira = true;                                                                                             // 231
}                                                                                                                     // 232
                                                                                                                      // 233
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/wrap_server.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
                                                                                                                      // 2
wrapServer = function(serverProto) {                                                                                  // 3
  var originalHandleConnect = serverProto._handleConnect                                                              // 4
  serverProto._handleConnect = function(socket, msg) {                                                                // 5
    originalHandleConnect.call(this, socket, msg);                                                                    // 6
    var session = socket._meteorSession;                                                                              // 7
    // sometimes it is possible for _meteorSession to be undefined                                                    // 8
    // one such reason would be if DDP versions are not matching                                                      // 9
    // if then, we should not process it                                                                              // 10
    if(!session) {                                                                                                    // 11
      return;                                                                                                         // 12
    }                                                                                                                 // 13
                                                                                                                      // 14
    Kadira.EventBus.emit('system', 'createSession', msg, socket._meteorSession);                                      // 15
                                                                                                                      // 16
    if(Kadira.connected) {                                                                                            // 17
      Kadira.models.system.handleSessionActivity(msg, socket._meteorSession);                                         // 18
    }                                                                                                                 // 19
  };                                                                                                                  // 20
};                                                                                                                    // 21
                                                                                                                      // 22
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/wrap_session.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
wrapSession = function(sessionProto) {                                                                                // 1
  var originalProcessMessage = sessionProto.processMessage;                                                           // 2
  sessionProto.processMessage = function(msg) {                                                                       // 3
    if(true) {                                                                                                        // 4
      var kadiraInfo = {                                                                                              // 5
        session: this.id,                                                                                             // 6
        userId: this.userId                                                                                           // 7
      };                                                                                                              // 8
                                                                                                                      // 9
      if(msg.msg == 'method' || msg.msg == 'sub') {                                                                   // 10
        kadiraInfo.trace = Kadira.tracer.start(this, msg);                                                            // 11
        Kadira.waitTimeBuilder.register(this, msg.id);                                                                // 12
                                                                                                                      // 13
        //use JSON stringify to save the CPU                                                                          // 14
        var startData = { userId: this.userId, params: JSON.stringify(msg.params) };                                  // 15
        Kadira.tracer.event(kadiraInfo.trace, 'start', startData);                                                    // 16
        var waitEventId = Kadira.tracer.event(kadiraInfo.trace, 'wait', {}, kadiraInfo);                              // 17
        msg._waitEventId = waitEventId;                                                                               // 18
        msg.__kadiraInfo = kadiraInfo;                                                                                // 19
                                                                                                                      // 20
        if(msg.msg == 'sub') {                                                                                        // 21
          // start tracking inside processMessage allows us to indicate                                               // 22
          // wait time as well                                                                                        // 23
          Kadira.EventBus.emit('pubsub', 'subReceived', this, msg);                                                   // 24
          Kadira.models.pubsub._trackSub(this, msg);                                                                  // 25
        }                                                                                                             // 26
      }                                                                                                               // 27
                                                                                                                      // 28
      // Update session last active time                                                                              // 29
      Kadira.EventBus.emit('system', 'ddpMessageReceived', this, msg);                                                // 30
      Kadira.models.system.handleSessionActivity(msg, this);                                                          // 31
    }                                                                                                                 // 32
                                                                                                                      // 33
    return originalProcessMessage.call(this, msg);                                                                    // 34
  };                                                                                                                  // 35
                                                                                                                      // 36
  //adding the method context to the current fiber                                                                    // 37
  var originalMethodHandler = sessionProto.protocol_handlers.method;                                                  // 38
  sessionProto.protocol_handlers.method = function(msg, unblock) {                                                    // 39
    var self = this;                                                                                                  // 40
    //add context                                                                                                     // 41
    var kadiraInfo = msg.__kadiraInfo;                                                                                // 42
    if(kadiraInfo) {                                                                                                  // 43
      Kadira._setInfo(kadiraInfo);                                                                                    // 44
                                                                                                                      // 45
      // end wait event                                                                                               // 46
      var waitList = Kadira.waitTimeBuilder.build(this, msg.id);                                                      // 47
      Kadira.tracer.eventEnd(kadiraInfo.trace, msg._waitEventId, {waitOn: waitList});                                 // 48
                                                                                                                      // 49
      unblock = Kadira.waitTimeBuilder.trackWaitTime(this, msg, unblock);                                             // 50
      var response = Kadira.env.kadiraInfo.withValue(kadiraInfo, function () {                                        // 51
        return originalMethodHandler.call(self, msg, unblock);                                                        // 52
      });                                                                                                             // 53
      unblock();                                                                                                      // 54
    } else {                                                                                                          // 55
      var response = originalMethodHandler.call(self, msg, unblock);                                                  // 56
    }                                                                                                                 // 57
                                                                                                                      // 58
    return response;                                                                                                  // 59
  };                                                                                                                  // 60
                                                                                                                      // 61
  //to capture the currently processing message                                                                       // 62
  var orginalSubHandler = sessionProto.protocol_handlers.sub;                                                         // 63
  sessionProto.protocol_handlers.sub = function(msg, unblock) {                                                       // 64
    var self = this;                                                                                                  // 65
    //add context                                                                                                     // 66
    var kadiraInfo = msg.__kadiraInfo;                                                                                // 67
    if(kadiraInfo) {                                                                                                  // 68
      Kadira._setInfo(kadiraInfo);                                                                                    // 69
                                                                                                                      // 70
      // end wait event                                                                                               // 71
      var waitList = Kadira.waitTimeBuilder.build(this, msg.id);                                                      // 72
      Kadira.tracer.eventEnd(kadiraInfo.trace, msg._waitEventId, {waitOn: waitList});                                 // 73
                                                                                                                      // 74
      unblock = Kadira.waitTimeBuilder.trackWaitTime(this, msg, unblock);                                             // 75
      var response = Kadira.env.kadiraInfo.withValue(kadiraInfo, function () {                                        // 76
        return orginalSubHandler.call(self, msg, unblock);                                                            // 77
      });                                                                                                             // 78
      unblock();                                                                                                      // 79
    } else {                                                                                                          // 80
      var response = orginalSubHandler.call(self, msg, unblock);                                                      // 81
    }                                                                                                                 // 82
                                                                                                                      // 83
    return response;                                                                                                  // 84
  };                                                                                                                  // 85
                                                                                                                      // 86
  //to capture the currently processing message                                                                       // 87
  var orginalUnSubHandler = sessionProto.protocol_handlers.unsub;                                                     // 88
  sessionProto.protocol_handlers.unsub = function(msg, unblock) {                                                     // 89
    unblock = Kadira.waitTimeBuilder.trackWaitTime(this, msg, unblock);                                               // 90
    var response = orginalUnSubHandler.call(this, msg, unblock);                                                      // 91
    unblock();                                                                                                        // 92
    return response;                                                                                                  // 93
  };                                                                                                                  // 94
                                                                                                                      // 95
  //track method ending (to get the result of error)                                                                  // 96
  var originalSend = sessionProto.send;                                                                               // 97
  sessionProto.send = function(msg) {                                                                                 // 98
    if(msg.msg == 'result') {                                                                                         // 99
      var kadiraInfo = Kadira._getInfo();                                                                             // 100
      if(kadiraInfo) {                                                                                                // 101
        if(msg.error) {                                                                                               // 102
          var error = _.pick(msg.error, ['message', 'stack']);                                                        // 103
                                                                                                                      // 104
          // pick the error from the wrapped method handler                                                           // 105
          if(kadiraInfo && kadiraInfo.currentError) {                                                                 // 106
            // the error stack is wrapped so Meteor._debug can identify                                               // 107
            // this as a method error.                                                                                // 108
            error = _.pick(kadiraInfo.currentError, ['message', 'stack']);                                            // 109
            // see wrapMethodHanderForErrors() method def for more info                                               // 110
            if(error.stack && error.stack.stack) {                                                                    // 111
              error.stack = error.stack.stack;                                                                        // 112
            }                                                                                                         // 113
          }                                                                                                           // 114
                                                                                                                      // 115
          Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                               // 116
          Kadira.tracer.event(kadiraInfo.trace, 'error', {error: error});                                             // 117
        } else {                                                                                                      // 118
          var isForced = Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                // 119
          if (isForced) {                                                                                             // 120
            console.warn('Kadira endevent forced complete', JSON.stringify(kadiraInfo.trace.events));                 // 121
          };                                                                                                          // 122
          Kadira.tracer.event(kadiraInfo.trace, 'complete');                                                          // 123
        }                                                                                                             // 124
                                                                                                                      // 125
        //processing the message                                                                                      // 126
        var trace = Kadira.tracer.buildTrace(kadiraInfo.trace);                                                       // 127
        Kadira.EventBus.emit('method', 'methodCompleted', trace, this);                                               // 128
        Kadira.models.methods.processMethod(trace);                                                                   // 129
                                                                                                                      // 130
        // error may or may not exist and error tracking can be disabled                                              // 131
        if(error && Kadira.options.enableErrorTracking) {                                                             // 132
          Kadira.models.error.trackError(error, trace);                                                               // 133
        }                                                                                                             // 134
                                                                                                                      // 135
        //clean and make sure, fiber is clean                                                                         // 136
        //not sure we need to do this, but a preventive measure                                                       // 137
        Kadira._setInfo(null);                                                                                        // 138
      }                                                                                                               // 139
    }                                                                                                                 // 140
                                                                                                                      // 141
    return originalSend.call(this, msg);                                                                              // 142
  };                                                                                                                  // 143
};                                                                                                                    // 144
                                                                                                                      // 145
// wrap existing method handlers for capturing errors                                                                 // 146
_.each(Meteor.default_server.method_handlers, function(handler, name) {                                               // 147
  wrapMethodHanderForErrors(name, handler, Meteor.default_server.method_handlers);                                    // 148
});                                                                                                                   // 149
                                                                                                                      // 150
// wrap future method handlers for capturing errors                                                                   // 151
var originalMeteorMethods = Meteor.methods;                                                                           // 152
Meteor.methods = function(methodMap) {                                                                                // 153
  _.each(methodMap, function(handler, name) {                                                                         // 154
    wrapMethodHanderForErrors(name, handler, methodMap);                                                              // 155
  });                                                                                                                 // 156
  originalMeteorMethods(methodMap);                                                                                   // 157
};                                                                                                                    // 158
                                                                                                                      // 159
                                                                                                                      // 160
function wrapMethodHanderForErrors(name, originalHandler, methodMap) {                                                // 161
  methodMap[name] = function() {                                                                                      // 162
    try{                                                                                                              // 163
      return originalHandler.apply(this, arguments);                                                                  // 164
    } catch(ex) {                                                                                                     // 165
      if(ex && Kadira._getInfo()) {                                                                                   // 166
        // sometimes error may be just an string or a primitive                                                       // 167
        // in that case, we need to make it a psuedo error                                                            // 168
        if(typeof ex !== 'object') {                                                                                  // 169
          ex = {message: ex, stack: ex};                                                                              // 170
        }                                                                                                             // 171
        // Now we are marking this error to get tracked via methods                                                   // 172
        // But, this also triggers a Meteor.debug call and                                                            // 173
        // it only gets the stack                                                                                     // 174
        // We also track Meteor.debug errors and want to stop                                                         // 175
        // tracking this error. That's why we do this                                                                 // 176
        // See Meteor.debug error tracking code for more                                                              // 177
        ex.stack = {stack: ex.stack, source: 'method'};                                                               // 178
        Kadira._getInfo().currentError = ex;                                                                          // 179
      }                                                                                                               // 180
      throw ex;                                                                                                       // 181
    }                                                                                                                 // 182
  }                                                                                                                   // 183
}                                                                                                                     // 184
                                                                                                                      // 185
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/wrap_subscription.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
                                                                                                                      // 2
wrapSubscription = function(subscriptionProto) {                                                                      // 3
  // If the ready event runs outside the Fiber, Kadira._getInfo() doesn't work.                                       // 4
  // we need some other way to store kadiraInfo so we can use it at ready hijack.                                     // 5
  var originalRunHandler = subscriptionProto._runHandler;                                                             // 6
  subscriptionProto._runHandler = function() {                                                                        // 7
    var kadiraInfo = Kadira._getInfo();                                                                               // 8
    if (kadiraInfo) {                                                                                                 // 9
      this.__kadiraInfo = kadiraInfo;                                                                                 // 10
    };                                                                                                                // 11
    originalRunHandler.call(this);                                                                                    // 12
  }                                                                                                                   // 13
                                                                                                                      // 14
  var originalReady = subscriptionProto.ready;                                                                        // 15
  subscriptionProto.ready = function() {                                                                              // 16
    // meteor has a field called `_ready` which tracks this                                                           // 17
    // but we need to make it future proof                                                                            // 18
    if(!this._apmReadyTracked) {                                                                                      // 19
      var kadiraInfo = Kadira._getInfo() || this.__kadiraInfo;                                                        // 20
      delete this.__kadiraInfo;                                                                                       // 21
      //sometime .ready can be called in the context of the method                                                    // 22
      //then we have some problems, that's why we are checking this                                                   // 23
      //eg:- Accounts.createUser                                                                                      // 24
      if(kadiraInfo && this._subscriptionId == kadiraInfo.trace.id) {                                                 // 25
        var isForced = Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                  // 26
        if (isForced) {                                                                                               // 27
          console.warn('Kadira endevent forced complete', JSON.stringify(kadiraInfo.trace.events));                   // 28
        };                                                                                                            // 29
        Kadira.tracer.event(kadiraInfo.trace, 'complete');                                                            // 30
        var trace = Kadira.tracer.buildTrace(kadiraInfo.trace);                                                       // 31
      }                                                                                                               // 32
                                                                                                                      // 33
      Kadira.EventBus.emit('pubsub', 'subCompleted', trace, this._session, this);                                     // 34
      Kadira.models.pubsub._trackReady(this._session, this, trace);                                                   // 35
      this._apmReadyTracked = true;                                                                                   // 36
    }                                                                                                                 // 37
                                                                                                                      // 38
    // we still pass the control to the original implementation                                                       // 39
    // since multiple ready calls are handled by itself                                                               // 40
    originalReady.call(this);                                                                                         // 41
  };                                                                                                                  // 42
                                                                                                                      // 43
  var originalError = subscriptionProto.error;                                                                        // 44
  subscriptionProto.error = function(err) {                                                                           // 45
    var kadiraInfo = Kadira._getInfo();                                                                               // 46
                                                                                                                      // 47
    if(kadiraInfo && this._subscriptionId == kadiraInfo.trace.id) {                                                   // 48
      Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                                   // 49
                                                                                                                      // 50
      var errorForApm = _.pick(err, 'message', 'stack');                                                              // 51
      Kadira.tracer.event(kadiraInfo.trace, 'error', {error: errorForApm});                                           // 52
      var trace = Kadira.tracer.buildTrace(kadiraInfo.trace);                                                         // 53
                                                                                                                      // 54
      Kadira.models.pubsub._trackError(this._session, this, trace);                                                   // 55
                                                                                                                      // 56
      // error tracking can be disabled and if there is a trace                                                       // 57
      // trace should be avaialble all the time, but it won't                                                         // 58
      // if something wrong happened on the trace building                                                            // 59
      if(Kadira.options.enableErrorTracking && trace) {                                                               // 60
        Kadira.models.error.trackError(err, trace);                                                                   // 61
      }                                                                                                               // 62
    }                                                                                                                 // 63
                                                                                                                      // 64
    // wrap error stack so Meteor._debug can identify and ignore it                                                   // 65
    err.stack = {stack: err.stack, source: 'subscription'};                                                           // 66
    originalError.call(this, err);                                                                                    // 67
  };                                                                                                                  // 68
                                                                                                                      // 69
  var originalDeactivate = subscriptionProto._deactivate;                                                             // 70
  subscriptionProto._deactivate = function() {                                                                        // 71
    Kadira.EventBus.emit('pubsub', 'subDeactivated', this._session, this);                                            // 72
    Kadira.models.pubsub._trackUnsub(this._session, this);                                                            // 73
    originalDeactivate.call(this);                                                                                    // 74
  };                                                                                                                  // 75
                                                                                                                      // 76
  //adding the currenSub env variable                                                                                 // 77
  ['added', 'changed', 'removed'].forEach(function(funcName) {                                                        // 78
    var originalFunc = subscriptionProto[funcName];                                                                   // 79
    subscriptionProto[funcName] = function(collectionName, id, fields) {                                              // 80
      var self = this;                                                                                                // 81
                                                                                                                      // 82
      //we need to run this code in a fiber and that's how we track                                                   // 83
      //subscription info. May be we can figure out, some other way to do this                                        // 84
      Kadira.env.currentSub = self;                                                                                   // 85
      var res = originalFunc.call(self, collectionName, id, fields);                                                  // 86
      Kadira.env.currentSub = null;                                                                                   // 87
                                                                                                                      // 88
      return res;                                                                                                     // 89
    };                                                                                                                // 90
  });                                                                                                                 // 91
};                                                                                                                    // 92
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/wrap_observers.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
wrapOplogObserveDriver = function(proto) {                                                                            // 1
  // Track the polled documents. This is reflect to the RAM size and                                                  // 2
  // for the CPU usage directly                                                                                       // 3
  var originalPublishNewResults = proto._publishNewResults;                                                           // 4
  proto._publishNewResults = function(newResults, newBuffer) {                                                        // 5
    var count = newResults.size() + newBuffer.size();                                                                 // 6
    if(this._ownerInfo) {                                                                                             // 7
      Kadira.models.pubsub.trackPolledDocuments(this._ownerInfo, count);                                              // 8
    } else {                                                                                                          // 9
      this._polledDocuments = count;                                                                                  // 10
    }                                                                                                                 // 11
    return originalPublishNewResults.call(this, newResults, newBuffer);                                               // 12
  };                                                                                                                  // 13
                                                                                                                      // 14
  var originalHandleOplogEntryQuerying = proto._handleOplogEntryQuerying;                                             // 15
  proto._handleOplogEntryQuerying = function(op) {                                                                    // 16
    Kadira.models.pubsub.trackDocumentChanges(this._ownerInfo, op);                                                   // 17
    return originalHandleOplogEntryQuerying.call(this, op);                                                           // 18
  };                                                                                                                  // 19
                                                                                                                      // 20
  var originalHandleOplogEntrySteadyOrFetching = proto._handleOplogEntrySteadyOrFetching;                             // 21
  proto._handleOplogEntrySteadyOrFetching = function(op) {                                                            // 22
    Kadira.models.pubsub.trackDocumentChanges(this._ownerInfo, op);                                                   // 23
    return originalHandleOplogEntrySteadyOrFetching.call(this, op);                                                   // 24
  };                                                                                                                  // 25
                                                                                                                      // 26
  // track live updates                                                                                               // 27
  ['_addPublished', '_removePublished', '_changePublished'].forEach(function(fnName) {                                // 28
    var originalFn = proto[fnName];                                                                                   // 29
    proto[fnName] = function(a, b, c) {                                                                               // 30
      if(this._ownerInfo) {                                                                                           // 31
        Kadira.models.pubsub.trackLiveUpdates(this._ownerInfo, fnName, 1);                                            // 32
      } else {                                                                                                        // 33
        // If there is no ownerInfo, that means this is the initial adds                                              // 34
        if(!this._liveUpdatesCounts) {                                                                                // 35
          this._liveUpdatesCounts = {                                                                                 // 36
            _initialAdds: 0                                                                                           // 37
          };                                                                                                          // 38
        }                                                                                                             // 39
                                                                                                                      // 40
        this._liveUpdatesCounts._initialAdds++;                                                                       // 41
      }                                                                                                               // 42
                                                                                                                      // 43
      return originalFn.call(this, a, b, c);                                                                          // 44
    };                                                                                                                // 45
  });                                                                                                                 // 46
                                                                                                                      // 47
  var originalStop = proto.stop;                                                                                      // 48
  proto.stop = function() {                                                                                           // 49
    if(this._ownerInfo && this._ownerInfo.type === 'sub') {                                                           // 50
      Kadira.EventBus.emit('pubsub', 'observerDeleted', this._ownerInfo);                                             // 51
      Kadira.models.pubsub.trackDeletedObserver(this._ownerInfo);                                                     // 52
    }                                                                                                                 // 53
                                                                                                                      // 54
    return originalStop.call(this);                                                                                   // 55
  };                                                                                                                  // 56
};                                                                                                                    // 57
                                                                                                                      // 58
wrapPollingObserveDriver = function(proto) {                                                                          // 59
  var originalPollMongo = proto._pollMongo;                                                                           // 60
  proto._pollMongo = function() {                                                                                     // 61
    var start = Date.now();                                                                                           // 62
    originalPollMongo.call(this);                                                                                     // 63
                                                                                                                      // 64
    // Current result is stored in the following variable.                                                            // 65
    // So, we can use that                                                                                            // 66
    // Sometimes, it's possible to get size as undefined.                                                             // 67
    // May be something with different version. We don't need to worry about                                          // 68
    // this now                                                                                                       // 69
    var count = this._results && this._results.size && this._results.size();                                          // 70
    count = count || 0;                                                                                               // 71
                                                                                                                      // 72
    if(this._ownerInfo) {                                                                                             // 73
      Kadira.models.pubsub.trackPolledDocuments(this._ownerInfo, count);                                              // 74
    } else {                                                                                                          // 75
      this._polledDocuments = count;                                                                                  // 76
    }                                                                                                                 // 77
  };                                                                                                                  // 78
                                                                                                                      // 79
  var originalStop = proto.stop;                                                                                      // 80
  proto.stop = function() {                                                                                           // 81
    if(this._ownerInfo && this._ownerInfo.type === 'sub') {                                                           // 82
      Kadira.EventBus.emit('pubsub', 'observerDeleted', this._ownerInfo);                                             // 83
      Kadira.models.pubsub.trackDeletedObserver(this._ownerInfo);                                                     // 84
    }                                                                                                                 // 85
                                                                                                                      // 86
    return originalStop.call(this);                                                                                   // 87
  };                                                                                                                  // 88
};                                                                                                                    // 89
                                                                                                                      // 90
wrapMultiplexer = function(proto) {                                                                                   // 91
  var originalInitalAdd = proto.addHandleAndSendInitialAdds;                                                          // 92
   proto.addHandleAndSendInitialAdds = function(handle) {                                                             // 93
    if(!this._firstInitialAddTime) {                                                                                  // 94
      this._firstInitialAddTime = Date.now();                                                                         // 95
    }                                                                                                                 // 96
                                                                                                                      // 97
    handle._wasMultiplexerReady = this._ready();                                                                      // 98
    handle._queueLength = this._queue._taskHandles.length;                                                            // 99
                                                                                                                      // 100
    if(!handle._wasMultiplexerReady) {                                                                                // 101
      handle._elapsedPollingTime = Date.now() - this._firstInitialAddTime;                                            // 102
    }                                                                                                                 // 103
    return originalInitalAdd.call(this, handle);                                                                      // 104
  };                                                                                                                  // 105
};                                                                                                                    // 106
                                                                                                                      // 107
wrapForCountingObservers = function() {                                                                               // 108
  // to count observers                                                                                               // 109
  var mongoConnectionProto = MeteorX.MongoConnection.prototype;                                                       // 110
  var originalObserveChanges = mongoConnectionProto._observeChanges;                                                  // 111
  mongoConnectionProto._observeChanges = function(cursorDescription, ordered, callbacks) {                            // 112
    var ret = originalObserveChanges.call(this, cursorDescription, ordered, callbacks);                               // 113
    // get the Kadira Info via the Meteor.EnvironmentalVariable                                                       // 114
    var kadiraInfo = Kadira._getInfo(null, true);                                                                     // 115
                                                                                                                      // 116
    if(kadiraInfo && ret._multiplexer) {                                                                              // 117
      if(!ret._multiplexer.__kadiraTracked) {                                                                         // 118
        // new multiplexer                                                                                            // 119
        ret._multiplexer.__kadiraTracked = true;                                                                      // 120
        Kadira.EventBus.emit('pubsub', 'newSubHandleCreated', kadiraInfo.trace);                                      // 121
        Kadira.models.pubsub.incrementHandleCount(kadiraInfo.trace, false);                                           // 122
        if(kadiraInfo.trace.type == 'sub') {                                                                          // 123
          var ownerInfo = {                                                                                           // 124
            type: kadiraInfo.trace.type,                                                                              // 125
            name: kadiraInfo.trace.name,                                                                              // 126
            startTime: (new Date()).getTime()                                                                         // 127
          };                                                                                                          // 128
                                                                                                                      // 129
          var observerDriver = ret._multiplexer._observeDriver;                                                       // 130
          observerDriver._ownerInfo = ownerInfo;                                                                      // 131
          Kadira.EventBus.emit('pubsub', 'observerCreated', ownerInfo);                                               // 132
          Kadira.models.pubsub.trackCreatedObserver(ownerInfo);                                                       // 133
                                                                                                                      // 134
          // We need to send initially polled documents if there are                                                  // 135
          if(observerDriver._polledDocuments) {                                                                       // 136
            Kadira.models.pubsub.trackPolledDocuments(ownerInfo, observerDriver._polledDocuments);                    // 137
            observerDriver._polledDocuments = 0;                                                                      // 138
          }                                                                                                           // 139
                                                                                                                      // 140
          // Process _liveUpdatesCounts                                                                               // 141
          _.each(observerDriver._liveUpdatesCounts, function(count, key) {                                            // 142
            Kadira.models.pubsub.trackLiveUpdates(ownerInfo, key, count);                                             // 143
          });                                                                                                         // 144
        }                                                                                                             // 145
      } else {                                                                                                        // 146
        Kadira.EventBus.emit('pubsub', 'cachedSubHandleCreated', kadiraInfo.trace);                                   // 147
        Kadira.models.pubsub.incrementHandleCount(kadiraInfo.trace, true);                                            // 148
      }                                                                                                               // 149
    }                                                                                                                 // 150
                                                                                                                      // 151
    return ret;                                                                                                       // 152
  }                                                                                                                   // 153
};                                                                                                                    // 154
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/instrument.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = Npm.require('debug')('kadira:hijack:instrument');                                                        // 1
                                                                                                                      // 2
var instrumented = false;                                                                                             // 3
Kadira._startInstrumenting = function(callback) {                                                                     // 4
  if(instrumented) {                                                                                                  // 5
    callback();                                                                                                       // 6
    return;                                                                                                           // 7
  }                                                                                                                   // 8
                                                                                                                      // 9
  instrumented = true;                                                                                                // 10
  MeteorX.onReady(function() {                                                                                        // 11
    //instrumenting session                                                                                           // 12
    wrapServer(MeteorX.Server.prototype);                                                                             // 13
    wrapSession(MeteorX.Session.prototype);                                                                           // 14
    wrapSubscription(MeteorX.Subscription.prototype);                                                                 // 15
                                                                                                                      // 16
    if(MeteorX.MongoOplogDriver) {                                                                                    // 17
      wrapOplogObserveDriver(MeteorX.MongoOplogDriver.prototype);                                                     // 18
    }                                                                                                                 // 19
                                                                                                                      // 20
    if(MeteorX.MongoPollingDriver) {                                                                                  // 21
      wrapPollingObserveDriver(MeteorX.MongoPollingDriver.prototype);                                                 // 22
    }                                                                                                                 // 23
                                                                                                                      // 24
    if(MeteorX.Multiplexer) {                                                                                         // 25
      wrapMultiplexer(MeteorX.Multiplexer.prototype);                                                                 // 26
    }                                                                                                                 // 27
                                                                                                                      // 28
    wrapForCountingObservers();                                                                                       // 29
    hijackDBOps();                                                                                                    // 30
                                                                                                                      // 31
    setLabels();                                                                                                      // 32
    callback();                                                                                                       // 33
  });                                                                                                                 // 34
};                                                                                                                    // 35
                                                                                                                      // 36
// We need to instrument this rightaway and it's okay                                                                 // 37
// One reason for this is to call `setLables()` function                                                              // 38
// Otherwise, CPU profile can't see all our custom labeling                                                           // 39
Kadira._startInstrumenting(function() {                                                                               // 40
  console.log('Kadira: completed instrumenting the app')                                                              // 41
});                                                                                                                   // 42
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/db.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// This hijack is important to make sure, collections created before                                                  // 1
// we hijack dbOps, even gets tracked.                                                                                // 2
//  Meteor does not simply expose MongoConnection object to the client                                                // 3
//  It picks methods which are necessory and make a binded object and                                                 // 4
//  assigned to the Mongo.Collection                                                                                  // 5
//  so, even we updated prototype, we can't track those collections                                                   // 6
//  but, this will fix it.                                                                                            // 7
var originalOpen = MongoInternals.RemoteCollectionDriver.prototype.open;                                              // 8
MongoInternals.RemoteCollectionDriver.prototype.open = function open(name) {                                          // 9
  var self = this;                                                                                                    // 10
  var ret = originalOpen.call(self, name);                                                                            // 11
                                                                                                                      // 12
  _.each(ret, function(fn, m) {                                                                                       // 13
    // make sure, it's in the actual mongo connection object                                                          // 14
    // meteorhacks:mongo-collection-utils package add some arbitary methods                                           // 15
    // which does not exist in the mongo connection                                                                   // 16
    if(self.mongo[m]) {                                                                                               // 17
      ret[m] = function() {                                                                                           // 18
        Array.prototype.unshift.call(arguments, name);                                                                // 19
        return OptimizedApply(self.mongo, self.mongo[m], arguments);                                                  // 20
      };                                                                                                              // 21
    }                                                                                                                 // 22
  });                                                                                                                 // 23
                                                                                                                      // 24
  return ret;                                                                                                         // 25
};                                                                                                                    // 26
                                                                                                                      // 27
hijackDBOps = function hijackDBOps() {                                                                                // 28
  var mongoConnectionProto = MeteorX.MongoConnection.prototype;                                                       // 29
  //findOne is handled by find - so no need to track it                                                               // 30
  //upsert is handles by update                                                                                       // 31
  ['find', 'update', 'remove', 'insert', '_ensureIndex', '_dropIndex'].forEach(function(func) {                       // 32
    var originalFunc = mongoConnectionProto[func];                                                                    // 33
    mongoConnectionProto[func] = function(collName, selector, mod, options) {                                         // 34
      var payload = {                                                                                                 // 35
        coll: collName,                                                                                               // 36
        func: func,                                                                                                   // 37
      };                                                                                                              // 38
                                                                                                                      // 39
      if(func == 'insert') {                                                                                          // 40
        //add nothing more to the payload                                                                             // 41
      } else if(func == '_ensureIndex' || func == '_dropIndex') {                                                     // 42
        //add index                                                                                                   // 43
        payload.index = JSON.stringify(selector);                                                                     // 44
      } else if(func == 'update' && options && options.upsert) {                                                      // 45
        payload.func = 'upsert';                                                                                      // 46
        payload.selector = JSON.stringify(selector);                                                                  // 47
      } else {                                                                                                        // 48
        //all the other functions have selectors                                                                      // 49
        payload.selector = JSON.stringify(selector);                                                                  // 50
      }                                                                                                               // 51
                                                                                                                      // 52
      var kadiraInfo = Kadira._getInfo();                                                                             // 53
      if(kadiraInfo) {                                                                                                // 54
        var eventId = Kadira.tracer.event(kadiraInfo.trace, 'db', payload);                                           // 55
      }                                                                                                               // 56
                                                                                                                      // 57
      //this cause V8 to avoid any performance optimizations, but this is must to use                                 // 58
      //otherwise, if the error adds try catch block our logs get messy and didn't work                               // 59
      //see: issue #6                                                                                                 // 60
      try{                                                                                                            // 61
        var ret = originalFunc.apply(this, arguments);                                                                // 62
        //handling functions which can be triggered with an asyncCallback                                             // 63
        var endOptions = {};                                                                                          // 64
                                                                                                                      // 65
        if(HaveAsyncCallback(arguments)) {                                                                            // 66
          endOptions.async = true;                                                                                    // 67
        }                                                                                                             // 68
                                                                                                                      // 69
        if(func == 'update') {                                                                                        // 70
          // upsert only returns an object when called `upsert` directly                                              // 71
          // otherwise it only act an update command                                                                  // 72
          if(options.upsert && typeof ret == 'object') {                                                              // 73
            endOptions.updatedDocs = ret.numberAffected;                                                              // 74
            endOptions.insertedId = ret.insertedId;                                                                   // 75
          } else {                                                                                                    // 76
            endOptions.updatedDocs = ret;                                                                             // 77
          }                                                                                                           // 78
        } else if(func == 'remove') {                                                                                 // 79
          endOptions.removedDocs = ret;                                                                               // 80
        }                                                                                                             // 81
                                                                                                                      // 82
        if(eventId) {                                                                                                 // 83
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, endOptions);                                              // 84
        }                                                                                                             // 85
      } catch(ex) {                                                                                                   // 86
        if(eventId) {                                                                                                 // 87
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                       // 88
        }                                                                                                             // 89
        throw ex;                                                                                                     // 90
      }                                                                                                               // 91
                                                                                                                      // 92
      return ret;                                                                                                     // 93
    };                                                                                                                // 94
  });                                                                                                                 // 95
                                                                                                                      // 96
  var cursorProto = MeteorX.MongoCursor.prototype;                                                                    // 97
  ['forEach', 'map', 'fetch', 'count', 'observeChanges', 'observe', 'rewind'].forEach(function(type) {                // 98
    var originalFunc = cursorProto[type];                                                                             // 99
    cursorProto[type] = function() {                                                                                  // 100
      var cursorDescription = this._cursorDescription;                                                                // 101
      var payload = {                                                                                                 // 102
        coll: cursorDescription.collectionName,                                                                       // 103
        selector: JSON.stringify(cursorDescription.selector),                                                         // 104
        func: type,                                                                                                   // 105
        cursor: true                                                                                                  // 106
      };                                                                                                              // 107
                                                                                                                      // 108
      if(cursorDescription.options) {                                                                                 // 109
        var cursorOptions = _.pick(cursorDescription.options, ['fields', 'sort', 'limit']);                           // 110
        for(var field in cursorOptions) {                                                                             // 111
          var value = cursorOptions[field]                                                                            // 112
          if(typeof value == 'object') {                                                                              // 113
            value = JSON.stringify(value);                                                                            // 114
          }                                                                                                           // 115
          payload[field] = value;                                                                                     // 116
        }                                                                                                             // 117
      };                                                                                                              // 118
                                                                                                                      // 119
      var kadiraInfo = Kadira._getInfo();                                                                             // 120
      if(kadiraInfo) {                                                                                                // 121
        var eventId = Kadira.tracer.event(kadiraInfo.trace, 'db', payload);                                           // 122
      }                                                                                                               // 123
                                                                                                                      // 124
      try{                                                                                                            // 125
        var ret = originalFunc.apply(this, arguments);                                                                // 126
                                                                                                                      // 127
        var endData = {};                                                                                             // 128
        if(type == 'observeChanges' || type == 'observe') {                                                           // 129
          var observerDriver;                                                                                         // 130
          endData.oplog = false;                                                                                      // 131
          // get data written by the multiplexer                                                                      // 132
          endData.wasMultiplexerReady = ret._wasMultiplexerReady;                                                     // 133
          endData.queueLength = ret._queueLength;                                                                     // 134
          endData.elapsedPollingTime = ret._elapsedPollingTime;                                                       // 135
                                                                                                                      // 136
          if(ret._multiplexer) {                                                                                      // 137
            endData.noOfHandles = Object.keys(ret._multiplexer._handles).length;                                      // 138
                                                                                                                      // 139
            // older meteor versions done not have an _multiplexer value                                              // 140
            observerDriver = ret._multiplexer._observeDriver;                                                         // 141
            if(observerDriver) {                                                                                      // 142
              observerDriver = ret._multiplexer._observeDriver;                                                       // 143
              var observerDriverClass = observerDriver.constructor;                                                   // 144
              var usesOplog = typeof observerDriverClass.cursorSupported == 'function';                               // 145
              endData.oplog = usesOplog;                                                                              // 146
              var size = 0;                                                                                           // 147
              ret._multiplexer._cache.docs.forEach(function() {size++});                                              // 148
              endData.noOfCachedDocs = size;                                                                          // 149
                                                                                                                      // 150
              // if multiplexerWasNotReady, we need to get the time spend for the polling                             // 151
              if(!ret._wasMultiplexerReady) {                                                                         // 152
                endData.initialPollingTime = observerDriver._lastPollTime;                                            // 153
              }                                                                                                       // 154
            }                                                                                                         // 155
          }                                                                                                           // 156
                                                                                                                      // 157
          if(!endData.oplog) {                                                                                        // 158
            // let's try to find the reason                                                                           // 159
            var reasonInfo = Kadira.checkWhyNoOplog(cursorDescription, observerDriver);                               // 160
            endData.noOplogCode = reasonInfo.code;                                                                    // 161
            endData.noOplogReason = reasonInfo.reason;                                                                // 162
            endData.noOplogSolution = reasonInfo.solution;                                                            // 163
          }                                                                                                           // 164
        } else if(type == 'fetch' || type == 'map'){                                                                  // 165
          //for other cursor operation                                                                                // 166
          endData.docsFetched = ret.length;                                                                           // 167
        }                                                                                                             // 168
                                                                                                                      // 169
        if(eventId) {                                                                                                 // 170
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, endData);                                                 // 171
        }                                                                                                             // 172
        return ret;                                                                                                   // 173
      } catch(ex) {                                                                                                   // 174
        if(eventId) {                                                                                                 // 175
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                       // 176
        }                                                                                                             // 177
        throw ex;                                                                                                     // 178
      }                                                                                                               // 179
    };                                                                                                                // 180
  });                                                                                                                 // 181
};                                                                                                                    // 182
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/http.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var originalCall = HTTP.call;                                                                                         // 1
                                                                                                                      // 2
HTTP.call = function(method, url) {                                                                                   // 3
  var kadiraInfo = Kadira._getInfo();                                                                                 // 4
  if(kadiraInfo) {                                                                                                    // 5
    var eventId = Kadira.tracer.event(kadiraInfo.trace, 'http', {method: method, url: url});                          // 6
  }                                                                                                                   // 7
                                                                                                                      // 8
  try {                                                                                                               // 9
    var response = originalCall.apply(this, arguments);                                                               // 10
                                                                                                                      // 11
    //if the user supplied an asynCallback, we don't have a response object and it handled asynchronously             // 12
    //we need to track it down to prevent issues like: #3                                                             // 13
    var endOptions = HaveAsyncCallback(arguments)? {async: true}: {statusCode: response.statusCode};                  // 14
    if(eventId) {                                                                                                     // 15
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, endOptions);                                                  // 16
    }                                                                                                                 // 17
    return response;                                                                                                  // 18
  } catch(ex) {                                                                                                       // 19
    if(eventId) {                                                                                                     // 20
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                           // 21
    }                                                                                                                 // 22
    throw ex;                                                                                                         // 23
  }                                                                                                                   // 24
};                                                                                                                    // 25
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/email.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var originalSend = Email.send;                                                                                        // 1
                                                                                                                      // 2
Email.send = function(options) {                                                                                      // 3
  var kadiraInfo = Kadira._getInfo();                                                                                 // 4
  if(kadiraInfo) {                                                                                                    // 5
    var data = _.pick(options, 'from', 'to', 'cc', 'bcc', 'replyTo');                                                 // 6
    var eventId = Kadira.tracer.event(kadiraInfo.trace, 'email', data);                                               // 7
  }                                                                                                                   // 8
  try {                                                                                                               // 9
    var ret = originalSend.call(this, options);                                                                       // 10
    if(eventId) {                                                                                                     // 11
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId);                                                              // 12
    }                                                                                                                 // 13
    return ret;                                                                                                       // 14
  } catch(ex) {                                                                                                       // 15
    if(eventId) {                                                                                                     // 16
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                           // 17
    }                                                                                                                 // 18
    throw ex;                                                                                                         // 19
  }                                                                                                                   // 20
};                                                                                                                    // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/async.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fibers = Npm.require('fibers');                                                                                   // 1
                                                                                                                      // 2
var originalYield = Fibers.yield;                                                                                     // 3
Fibers.yield = function() {                                                                                           // 4
  var kadiraInfo = Kadira._getInfo();                                                                                 // 5
  if(kadiraInfo) {                                                                                                    // 6
    var eventId = Kadira.tracer.event(kadiraInfo.trace, 'async');;                                                    // 7
    if(eventId) {                                                                                                     // 8
      Fibers.current._apmEventId = eventId;                                                                           // 9
    }                                                                                                                 // 10
  }                                                                                                                   // 11
                                                                                                                      // 12
  return originalYield();                                                                                             // 13
};                                                                                                                    // 14
                                                                                                                      // 15
var originalRun = Fibers.prototype.run;                                                                               // 16
Fibers.prototype.run = function(val) {                                                                                // 17
  if(this._apmEventId) {                                                                                              // 18
    var kadiraInfo = Kadira._getInfo(this);                                                                           // 19
    if(kadiraInfo) {                                                                                                  // 20
      Kadira.tracer.eventEnd(kadiraInfo.trace, this._apmEventId);                                                     // 21
      this._apmEventId = null;                                                                                        // 22
    }                                                                                                                 // 23
  }                                                                                                                   // 24
  return originalRun.call(this, val);                                                                                 // 25
};                                                                                                                    // 26
                                                                                                                      // 27
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/error.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
TrackUncaughtExceptions = function () {                                                                               // 1
  process.on('uncaughtException', function (err) {                                                                    // 2
    // skip errors with `_skipKadira` flag                                                                            // 3
    if(err._skipKadira) {                                                                                             // 4
      return;                                                                                                         // 5
    }                                                                                                                 // 6
                                                                                                                      // 7
    // let the server crash normally if error tracking is disabled                                                    // 8
    if(!Kadira.options.enableErrorTracking) {                                                                         // 9
      printErrorAndKill(err);                                                                                         // 10
    }                                                                                                                 // 11
                                                                                                                      // 12
    // looking for already tracked errors and throw them immediately                                                  // 13
    // throw error immediately if kadira is not ready                                                                 // 14
    if(err._tracked || !Kadira.connected) {                                                                           // 15
      printErrorAndKill(err);                                                                                         // 16
    }                                                                                                                 // 17
                                                                                                                      // 18
    var trace = getTrace(err, 'server-crash', 'uncaughtException');                                                   // 19
    Kadira.models.error.trackError(err, trace);                                                                       // 20
    Kadira._sendPayload(function () {                                                                                 // 21
      clearTimeout(timer);                                                                                            // 22
      throwError(err);                                                                                                // 23
    });                                                                                                               // 24
                                                                                                                      // 25
    var timer = setTimeout(function () {                                                                              // 26
      throwError(err);                                                                                                // 27
    }, 1000*10);                                                                                                      // 28
                                                                                                                      // 29
    function throwError(err) {                                                                                        // 30
      // sometimes error came back from a fiber.                                                                      // 31
      // But we don't fibers to track that error for us                                                               // 32
      // That's why we throw the error on the nextTick                                                                // 33
      process.nextTick(function() {                                                                                   // 34
        // we need to mark this error where we really need to throw                                                   // 35
        err._tracked = true;                                                                                          // 36
        printErrorAndKill(err);                                                                                       // 37
      });                                                                                                             // 38
    }                                                                                                                 // 39
  });                                                                                                                 // 40
                                                                                                                      // 41
  function printErrorAndKill(err) {                                                                                   // 42
    // since we are capturing error, we are also on the error message.                                                // 43
    // so developers think we are also reponsible for the error.                                                      // 44
    // But we are not. This will fix that.                                                                            // 45
    console.error(err.stack);                                                                                         // 46
    process.exit(7);                                                                                                  // 47
  }                                                                                                                   // 48
}                                                                                                                     // 49
                                                                                                                      // 50
TrackMeteorDebug = function () {                                                                                      // 51
  var originalMeteorDebug = Meteor._debug;                                                                            // 52
  Meteor._debug = function (message, stack) {                                                                         // 53
    if(!Kadira.options.enableErrorTracking) {                                                                         // 54
      return originalMeteorDebug.call(this, message, stack);                                                          // 55
    }                                                                                                                 // 56
                                                                                                                      // 57
    // We've changed `stack` into an object at method and sub handlers so we can                                      // 58
    // ignore them here. These errors are already tracked so don't track again.                                       // 59
    if(stack && stack.stack) {                                                                                        // 60
      stack = stack.stack                                                                                             // 61
    } else {                                                                                                          // 62
      // only send to the server, if only connected to kadira                                                         // 63
      if(Kadira.connected) {                                                                                          // 64
        var error = new Error(message);                                                                               // 65
        error.stack = stack;                                                                                          // 66
        var trace = getTrace(error, 'server-internal', 'Meteor._debug');                                              // 67
        Kadira.models.error.trackError(error, trace);                                                                 // 68
      }                                                                                                               // 69
    }                                                                                                                 // 70
                                                                                                                      // 71
    return originalMeteorDebug.apply(this, arguments);                                                                // 72
  }                                                                                                                   // 73
}                                                                                                                     // 74
                                                                                                                      // 75
function getTrace(err, type, subType) {                                                                               // 76
  return {                                                                                                            // 77
    type: type,                                                                                                       // 78
    subType: subType,                                                                                                 // 79
    name: err.message,                                                                                                // 80
    errored: true,                                                                                                    // 81
    at: Kadira.syncedDate.getTime(),                                                                                  // 82
    events: [                                                                                                         // 83
      ['start', 0, {}],                                                                                               // 84
      ['error', 0, {error: {message: err.message, stack: err.stack}}]                                                 // 85
    ],                                                                                                                // 86
    metrics: {                                                                                                        // 87
      total: 0                                                                                                        // 88
    }                                                                                                                 // 89
  };                                                                                                                  // 90
}                                                                                                                     // 91
                                                                                                                      // 92
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/hijack/set_labels.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
setLabels = function () {                                                                                             // 1
  // name Session.prototype.send                                                                                      // 2
  var originalSend = MeteorX.Session.prototype.send;                                                                  // 3
  MeteorX.Session.prototype.send = function kadira_Session_send (msg) {                                               // 4
    return originalSend.call(this, msg);                                                                              // 5
  }                                                                                                                   // 6
                                                                                                                      // 7
  // name mongodb.Connection.createDataHandler                                                                        // 8
  var mongodb = MongoInternals.NpmModule;                                                                             // 9
  var originalCreateDataHandler = mongodb.Connection.createDataHandler;                                               // 10
  mongodb.Connection.createDataHandler = function (self) {                                                            // 11
    var originalHandler = originalCreateDataHandler.call(this, self);                                                 // 12
    return function kadira_MongoDB_dataHandler (data) {                                                               // 13
      return originalHandler.call(this, data);                                                                        // 14
    }                                                                                                                 // 15
  }                                                                                                                   // 16
                                                                                                                      // 17
  // name Multiplexer initial adds                                                                                    // 18
  var originalSendAdds = MeteorX.Multiplexer.prototype._sendAdds;                                                     // 19
  MeteorX.Multiplexer.prototype._sendAdds = function kadira_Multiplexer_sendAdds (handle) {                           // 20
    return originalSendAdds.call(this, handle);                                                                       // 21
  }                                                                                                                   // 22
                                                                                                                      // 23
  // name MongoConnection insert                                                                                      // 24
  var originalMongoInsert = MeteorX.MongoConnection.prototype._insert;                                                // 25
  MeteorX.MongoConnection.prototype._insert = function kadira_MongoConnection_insert (coll, doc, cb) {                // 26
    return originalMongoInsert.call(this, coll, doc, cb);                                                             // 27
  }                                                                                                                   // 28
                                                                                                                      // 29
  // name MongoConnection update                                                                                      // 30
  var originalMongoUpdate = MeteorX.MongoConnection.prototype._update;                                                // 31
  MeteorX.MongoConnection.prototype._update = function kadira_MongoConnection_update (coll, selector, mod, options, cb) {
    return originalMongoUpdate.call(this, coll, selector, mod, options, cb);                                          // 33
  }                                                                                                                   // 34
                                                                                                                      // 35
  // name MongoConnection remove                                                                                      // 36
  var originalMongoRemove = MeteorX.MongoConnection.prototype._remove;                                                // 37
  MeteorX.MongoConnection.prototype._remove = function kadira_MongoConnection_remove (coll, selector, cb) {           // 38
    return originalMongoRemove.call(this, coll, selector, cb);                                                        // 39
  }                                                                                                                   // 40
                                                                                                                      // 41
  // name Pubsub added                                                                                                // 42
  var originalPubsubAdded = MeteorX.Session.prototype.sendAdded;                                                      // 43
  MeteorX.Session.prototype.sendAdded = function kadira_Session_sendAdded (coll, id, fields) {                        // 44
    return originalPubsubAdded.call(this, coll, id, fields);                                                          // 45
  }                                                                                                                   // 46
                                                                                                                      // 47
  // name Pubsub changed                                                                                              // 48
  var originalPubsubChanged = MeteorX.Session.prototype.sendChanged;                                                  // 49
  MeteorX.Session.prototype.sendChanged = function kadira_Session_sendChanged (coll, id, fields) {                    // 50
    return originalPubsubChanged.call(this, coll, id, fields);                                                        // 51
  }                                                                                                                   // 52
                                                                                                                      // 53
  // name Pubsub removed                                                                                              // 54
  var originalPubsubRemoved = MeteorX.Session.prototype.sendRemoved;                                                  // 55
  MeteorX.Session.prototype.sendRemoved = function kadira_Session_sendRemoved (coll, id) {                            // 56
    return originalPubsubRemoved.call(this, coll, id);                                                                // 57
  }                                                                                                                   // 58
                                                                                                                      // 59
  // name MongoCursor forEach                                                                                         // 60
  var originalCursorForEach = MeteorX.MongoCursor.prototype.forEach;                                                  // 61
  MeteorX.MongoCursor.prototype.forEach = function kadira_Cursor_forEach () {                                         // 62
    return originalCursorForEach.apply(this, arguments);                                                              // 63
  }                                                                                                                   // 64
                                                                                                                      // 65
  // name MongoCursor map                                                                                             // 66
  var originalCursorMap = MeteorX.MongoCursor.prototype.map;                                                          // 67
  MeteorX.MongoCursor.prototype.map = function kadira_Cursor_map () {                                                 // 68
    return originalCursorMap.apply(this, arguments);                                                                  // 69
  }                                                                                                                   // 70
                                                                                                                      // 71
  // name MongoCursor fetch                                                                                           // 72
  var originalCursorFetch = MeteorX.MongoCursor.prototype.fetch;                                                      // 73
  MeteorX.MongoCursor.prototype.fetch = function kadira_Cursor_fetch () {                                             // 74
    return originalCursorFetch.apply(this, arguments);                                                                // 75
  }                                                                                                                   // 76
                                                                                                                      // 77
  // name MongoCursor count                                                                                           // 78
  var originalCursorCount = MeteorX.MongoCursor.prototype.count;                                                      // 79
  MeteorX.MongoCursor.prototype.count = function kadira_Cursor_count () {                                             // 80
    return originalCursorCount.apply(this, arguments);                                                                // 81
  }                                                                                                                   // 82
                                                                                                                      // 83
  // name MongoCursor observeChanges                                                                                  // 84
  var originalCursorObserveChanges = MeteorX.MongoCursor.prototype.observeChanges;                                    // 85
  MeteorX.MongoCursor.prototype.observeChanges = function kadira_Cursor_observeChanges () {                           // 86
    return originalCursorObserveChanges.apply(this, arguments);                                                       // 87
  }                                                                                                                   // 88
                                                                                                                      // 89
  // name MongoCursor observe                                                                                         // 90
  var originalCursorObserve = MeteorX.MongoCursor.prototype.observe;                                                  // 91
  MeteorX.MongoCursor.prototype.observe = function kadira_Cursor_observe () {                                         // 92
    return originalCursorObserve.apply(this, arguments);                                                              // 93
  }                                                                                                                   // 94
                                                                                                                      // 95
  // name MongoCursor rewind                                                                                          // 96
  var originalCursorRewind = MeteorX.MongoCursor.prototype.rewind;                                                    // 97
  MeteorX.MongoCursor.prototype.rewind = function kadira_Cursor_rewind () {                                           // 98
    return originalCursorRewind.apply(this, arguments);                                                               // 99
  }                                                                                                                   // 100
                                                                                                                      // 101
  // name CrossBar listen                                                                                             // 102
  var originalCrossbarListen = DDPServer._Crossbar.prototype.listen;                                                  // 103
  DDPServer._Crossbar.prototype.listen = function kadira_Crossbar_listen (trigger, callback) {                        // 104
    return originalCrossbarListen.call(this, trigger, callback);                                                      // 105
  }                                                                                                                   // 106
                                                                                                                      // 107
  // name CrossBar fire                                                                                               // 108
  var originalCrossbarFire = DDPServer._Crossbar.prototype.fire;                                                      // 109
  DDPServer._Crossbar.prototype.fire = function kadira_Crossbar_fire (notification) {                                 // 110
    return originalCrossbarFire.call(this, notification);                                                             // 111
  }                                                                                                                   // 112
}                                                                                                                     // 113
                                                                                                                      // 114
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/environment_variables.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira._parseEnv = function (env) {                                                                                   // 1
  var options = {};                                                                                                   // 2
  for(var name in env) {                                                                                              // 3
    var info = Kadira._parseEnv._options[name];                                                                       // 4
    var value = env[name];                                                                                            // 5
    if(info && value) {                                                                                               // 6
      options[info.name] = info.parser(value);                                                                        // 7
    }                                                                                                                 // 8
  }                                                                                                                   // 9
                                                                                                                      // 10
  return options;                                                                                                     // 11
};                                                                                                                    // 12
                                                                                                                      // 13
                                                                                                                      // 14
Kadira._parseEnv.parseInt = function (str) {                                                                          // 15
  var num = parseInt(str);                                                                                            // 16
  if(num || num === 0) return num;                                                                                    // 17
  throw new Error('Kadira: Match Error: "'+num+'" is not a number');                                                  // 18
};                                                                                                                    // 19
                                                                                                                      // 20
                                                                                                                      // 21
Kadira._parseEnv.parseBool = function (str) {                                                                         // 22
  str = str.toLowerCase();                                                                                            // 23
  if(str === 'true') return true;                                                                                     // 24
  if(str === 'false') return false;                                                                                   // 25
  throw new Error('Kadira: Match Error: '+str+' is not a boolean');                                                   // 26
};                                                                                                                    // 27
                                                                                                                      // 28
                                                                                                                      // 29
Kadira._parseEnv.parseUrl = function (str) {                                                                          // 30
  return str;                                                                                                         // 31
};                                                                                                                    // 32
                                                                                                                      // 33
                                                                                                                      // 34
Kadira._parseEnv.parseString = function (str) {                                                                       // 35
  return str;                                                                                                         // 36
};                                                                                                                    // 37
                                                                                                                      // 38
                                                                                                                      // 39
Kadira._parseEnv._options = {                                                                                         // 40
  // delay to send the initial ping to the kadira engine after page loads                                             // 41
  KADIRA_OPTIONS_CLIENT_ENGINE_SYNC_DELAY: {                                                                          // 42
    name: 'clientEngineSyncDelay',                                                                                    // 43
    parser: Kadira._parseEnv.parseInt,                                                                                // 44
  },                                                                                                                  // 45
  // time between sending errors to the engine                                                                        // 46
  KADIRA_OPTIONS_ERROR_DUMP_INTERVAL: {                                                                               // 47
    name: 'errorDumpInterval',                                                                                        // 48
    parser: Kadira._parseEnv.parseInt,                                                                                // 49
  },                                                                                                                  // 50
  // no of errors allowed in a given interval                                                                         // 51
  KADIRA_OPTIONS_MAX_ERRORS_PER_INTERVAL: {                                                                           // 52
    name: 'maxErrorsPerInterval',                                                                                     // 53
    parser: Kadira._parseEnv.parseInt,                                                                                // 54
  },                                                                                                                  // 55
  // a zone.js specific option to collect the full stack trace(which is not much useful)                              // 56
  KADIRA_OPTIONS_COLLECT_ALL_STACKS: {                                                                                // 57
    name: 'collectAllStacks',                                                                                         // 58
    parser: Kadira._parseEnv.parseBool,                                                                               // 59
  },                                                                                                                  // 60
  // enable error tracking (which is turned on by default)                                                            // 61
  KADIRA_OPTIONS_ENABLE_ERROR_TRACKING: {                                                                             // 62
    name: 'enableErrorTracking',                                                                                      // 63
    parser: Kadira._parseEnv.parseBool,                                                                               // 64
  },                                                                                                                  // 65
  // kadira engine endpoint                                                                                           // 66
  KADIRA_OPTIONS_ENDPOINT: {                                                                                          // 67
    name: 'endpoint',                                                                                                 // 68
    parser: Kadira._parseEnv.parseUrl,                                                                                // 69
  },                                                                                                                  // 70
  // define the hostname of the current running process                                                               // 71
  KADIRA_OPTIONS_HOSTNAME: {                                                                                          // 72
    name: 'hostname',                                                                                                 // 73
    parser: Kadira._parseEnv.parseString,                                                                             // 74
  },                                                                                                                  // 75
  // interval between sending data to the kadira engine from the server                                               // 76
  KADIRA_OPTIONS_PAYLOAD_TIMEOUT: {                                                                                   // 77
    name: 'payloadTimeout',                                                                                           // 78
    parser: Kadira._parseEnv.parseInt,                                                                                // 79
  },                                                                                                                  // 80
  // set HTTP/HTTPS proxy                                                                                             // 81
  KADIRA_OPTIONS_PROXY: {                                                                                             // 82
    name: 'proxy',                                                                                                    // 83
    parser: Kadira._parseEnv.parseUrl,                                                                                // 84
  },                                                                                                                  // 85
};                                                                                                                    // 86
                                                                                                                      // 87
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/auto_connect.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira._connectWithEnv = function() {                                                                                 // 1
  if(process.env.KADIRA_APP_ID && process.env.KADIRA_APP_SECRET) {                                                    // 2
    var options = Kadira._parseEnv(process.env);                                                                      // 3
                                                                                                                      // 4
    Kadira.connect(                                                                                                   // 5
      process.env.KADIRA_APP_ID,                                                                                      // 6
      process.env.KADIRA_APP_SECRET,                                                                                  // 7
      options                                                                                                         // 8
    );                                                                                                                // 9
                                                                                                                      // 10
    Kadira.connect = function() {                                                                                     // 11
      throw new Error('Kadira has been already connected using credentials from Environment Variables');              // 12
    };                                                                                                                // 13
  }                                                                                                                   // 14
};                                                                                                                    // 15
                                                                                                                      // 16
                                                                                                                      // 17
Kadira._connectWithSettings = function () {                                                                           // 18
  if(                                                                                                                 // 19
    Meteor.settings.kadira &&                                                                                         // 20
    Meteor.settings.kadira.appId &&                                                                                   // 21
    Meteor.settings.kadira.appSecret                                                                                  // 22
  ) {                                                                                                                 // 23
    Kadira.connect(                                                                                                   // 24
      Meteor.settings.kadira.appId,                                                                                   // 25
      Meteor.settings.kadira.appSecret,                                                                               // 26
      Meteor.settings.kadira.options || {}                                                                            // 27
    );                                                                                                                // 28
                                                                                                                      // 29
    Kadira.connect = function() {                                                                                     // 30
      throw new Error('Kadira has been already connected using credentials from Meteor.settings');                    // 31
    };                                                                                                                // 32
  }                                                                                                                   // 33
};                                                                                                                    // 34
                                                                                                                      // 35
                                                                                                                      // 36
// Try to connect automatically                                                                                       // 37
Kadira._connectWithEnv();                                                                                             // 38
Kadira._connectWithSettings();                                                                                        // 39
                                                                                                                      // 40
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/common/default_error_filters.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var commonErrRegExps = [                                                                                              // 1
  /connection timeout\. no (\w*) heartbeat received/i,                                                                // 2
  /INVALID_STATE_ERR/i,                                                                                               // 3
];                                                                                                                    // 4
                                                                                                                      // 5
Kadira.errorFilters = {                                                                                               // 6
  filterValidationErrors: function(type, message, err) {                                                              // 7
    if(err && err instanceof Meteor.Error) {                                                                          // 8
      return false;                                                                                                   // 9
    } else {                                                                                                          // 10
      return true;                                                                                                    // 11
    }                                                                                                                 // 12
  },                                                                                                                  // 13
                                                                                                                      // 14
  filterCommonMeteorErrors: function(type, message) {                                                                 // 15
    for(var lc=0; lc<commonErrRegExps.length; lc++) {                                                                 // 16
      var regExp = commonErrRegExps[lc];                                                                              // 17
      if(regExp.test(message)) {                                                                                      // 18
        return false;                                                                                                 // 19
      }                                                                                                               // 20
    }                                                                                                                 // 21
    return true;                                                                                                      // 22
  }                                                                                                                   // 23
};                                                                                                                    // 24
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks_kadira/lib/common/send.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira.send = function (payload, path, callback) {                                                                    // 1
  if(!Kadira.connected)  {                                                                                            // 2
    throw new Error("You need to connect with Kadira first, before sending messages!");                               // 3
  }                                                                                                                   // 4
                                                                                                                      // 5
  path = (path.substr(0, 1) != '/')? "/" + path : path;                                                               // 6
  var endpoint = Kadira.options.endpoint + path;                                                                      // 7
  var retryCount = 0;                                                                                                 // 8
  var retry = new Retry({                                                                                             // 9
    minCount: 1,                                                                                                      // 10
    minTimeout: 0,                                                                                                    // 11
    baseTimeout: 1000*5,                                                                                              // 12
    maxTimeout: 1000*60,                                                                                              // 13
  });                                                                                                                 // 14
                                                                                                                      // 15
  var sendFunction = Kadira._getSendFunction();                                                                       // 16
  tryToSend();                                                                                                        // 17
                                                                                                                      // 18
  function tryToSend(err) {                                                                                           // 19
    if(retryCount < 5) {                                                                                              // 20
      retry.retryLater(retryCount++, send);                                                                           // 21
    } else {                                                                                                          // 22
      console.warn('Error sending error traces to kadira server');                                                    // 23
      if(callback) callback(err);                                                                                     // 24
    }                                                                                                                 // 25
  }                                                                                                                   // 26
                                                                                                                      // 27
  function send() {                                                                                                   // 28
    sendFunction(endpoint, payload, function(err, content, statusCode) {                                              // 29
      if(err) {                                                                                                       // 30
        tryToSend(err);                                                                                               // 31
      } else if(statusCode == 200){                                                                                   // 32
        if(callback) callback(null, content);                                                                         // 33
      } else {                                                                                                        // 34
        if(callback) callback(new Meteor.Error(statusCode, content));                                                 // 35
      }                                                                                                               // 36
    });                                                                                                               // 37
  }                                                                                                                   // 38
};                                                                                                                    // 39
                                                                                                                      // 40
Kadira._getSendFunction = function() {                                                                                // 41
  return (Meteor.isServer)? Kadira._serverSend : Kadira._clientSend;                                                  // 42
};                                                                                                                    // 43
                                                                                                                      // 44
Kadira._clientSend = function (endpoint, payload, callback) {                                                         // 45
  $.ajax({                                                                                                            // 46
    type: 'POST',                                                                                                     // 47
    url: endpoint,                                                                                                    // 48
    contentType: 'application/json',                                                                                  // 49
    data: JSON.stringify(payload),                                                                                    // 50
    error: function(err) {                                                                                            // 51
      callback(err);                                                                                                  // 52
    },                                                                                                                // 53
    success: function(data) {                                                                                         // 54
      callback(null, data, 200);                                                                                      // 55
    }                                                                                                                 // 56
  });                                                                                                                 // 57
}                                                                                                                     // 58
                                                                                                                      // 59
Kadira._serverSend = function (endpoint, payload, callback) {                                                         // 60
  callback = callback || function() {};                                                                               // 61
  var Fiber = Npm.require('fibers');                                                                                  // 62
  new Fiber(function() {                                                                                              // 63
    var httpOptions = {                                                                                               // 64
      data: payload,                                                                                                  // 65
      headers: Kadira.options.authHeaders                                                                             // 66
    };                                                                                                                // 67
                                                                                                                      // 68
    HTTP.call('POST', endpoint, httpOptions, function(err, res) {                                                     // 69
      if(res) {                                                                                                       // 70
        var content = (res.statusCode == 200)? res.data : res.content;                                                // 71
        callback(null, content, res.statusCode);                                                                      // 72
      } else {                                                                                                        // 73
        callback(err);                                                                                                // 74
      }                                                                                                               // 75
    });                                                                                                               // 76
  }).run();                                                                                                           // 77
}                                                                                                                     // 78
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:kadira'] = {
  Kadira: Kadira
};

})();

//# sourceMappingURL=meteorhacks_kadira.js.map
