(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/jaywon_meteor-node-uuid/packages/jaywon_meteor-node-uuid.js                   //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
(function () {                                                                            // 1
                                                                                          // 2
/////////////////////////////////////////////////////////////////////////////////////     // 3
//                                                                                 //     // 4
// packages/jaywon:meteor-node-uuid/node-uuid/uuid.js                              //     // 5
//                                                                                 //     // 6
/////////////////////////////////////////////////////////////////////////////////////     // 7
                                                                                   //     // 8
//     uuid.js                                                                     // 1   // 9
//                                                                                 // 2   // 10
//     Copyright (c) 2010-2012 Robert Kieffer                                      // 3   // 11
//     MIT License - http://opensource.org/licenses/mit-license.php                // 4   // 12
                                                                                   // 5   // 13
(function() {                                                                      // 6   // 14
  var _global = this;                                                              // 7   // 15
                                                                                   // 8   // 16
  // Unique ID creation requires a high quality random # generator.  We feature    // 9   // 17
  // detect to determine the best RNG source, normalizing to a function that       // 10  // 18
  // returns 128-bits of randomness, since that's what's usually required          // 11  // 19
  var _rng;                                                                        // 12  // 20
                                                                                   // 13  // 21
  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html      // 14  // 22
  //                                                                               // 15  // 23
  // Moderately fast, high quality                                                 // 16  // 24
  if (typeof(_global.require) == 'function') {                                     // 17  // 25
    try {                                                                          // 18  // 26
      var _rb = _global.require('crypto').randomBytes;                             // 19  // 27
      _rng = _rb && function() {return _rb(16);};                                  // 20  // 28
    } catch(e) {}                                                                  // 21  // 29
  }                                                                                // 22  // 30
                                                                                   // 23  // 31
  if (!_rng && _global.crypto && crypto.getRandomValues) {                         // 24  // 32
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto                // 25  // 33
    //                                                                             // 26  // 34
    // Moderately fast, high quality                                               // 27  // 35
    var _rnds8 = new Uint8Array(16);                                               // 28  // 36
    _rng = function whatwgRNG() {                                                  // 29  // 37
      crypto.getRandomValues(_rnds8);                                              // 30  // 38
      return _rnds8;                                                               // 31  // 39
    };                                                                             // 32  // 40
  }                                                                                // 33  // 41
                                                                                   // 34  // 42
  if (!_rng) {                                                                     // 35  // 43
    // Math.random()-based (RNG)                                                   // 36  // 44
    //                                                                             // 37  // 45
    // If all else fails, use Math.random().  It's fast, but is of unspecified     // 38  // 46
    // quality.                                                                    // 39  // 47
    var  _rnds = new Array(16);                                                    // 40  // 48
    _rng = function() {                                                            // 41  // 49
      for (var i = 0, r; i < 16; i++) {                                            // 42  // 50
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;                     // 43  // 51
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;                                 // 44  // 52
      }                                                                            // 45  // 53
                                                                                   // 46  // 54
      return _rnds;                                                                // 47  // 55
    };                                                                             // 48  // 56
  }                                                                                // 49  // 57
                                                                                   // 50  // 58
  // Buffer class to use                                                           // 51  // 59
  var BufferClass = typeof(_global.Buffer) == 'function' ? _global.Buffer : Array; // 52  // 60
                                                                                   // 53  // 61
  // Maps for number <-> hex string conversion                                     // 54  // 62
  var _byteToHex = [];                                                             // 55  // 63
  var _hexToByte = {};                                                             // 56  // 64
  for (var i = 0; i < 256; i++) {                                                  // 57  // 65
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);                            // 58  // 66
    _hexToByte[_byteToHex[i]] = i;                                                 // 59  // 67
  }                                                                                // 60  // 68
                                                                                   // 61  // 69
  // **`parse()` - Parse a UUID into it's component bytes**                        // 62  // 70
  function parse(s, buf, offset) {                                                 // 63  // 71
    var i = (buf && offset) || 0, ii = 0;                                          // 64  // 72
                                                                                   // 65  // 73
    buf = buf || [];                                                               // 66  // 74
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {                        // 67  // 75
      if (ii < 16) { // Don't overflow!                                            // 68  // 76
        buf[i + ii++] = _hexToByte[oct];                                           // 69  // 77
      }                                                                            // 70  // 78
    });                                                                            // 71  // 79
                                                                                   // 72  // 80
    // Zero out remaining bytes if string was short                                // 73  // 81
    while (ii < 16) {                                                              // 74  // 82
      buf[i + ii++] = 0;                                                           // 75  // 83
    }                                                                              // 76  // 84
                                                                                   // 77  // 85
    return buf;                                                                    // 78  // 86
  }                                                                                // 79  // 87
                                                                                   // 80  // 88
  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**         // 81  // 89
  function unparse(buf, offset) {                                                  // 82  // 90
    var i = offset || 0, bth = _byteToHex;                                         // 83  // 91
    return  bth[buf[i++]] + bth[buf[i++]] +                                        // 84  // 92
            bth[buf[i++]] + bth[buf[i++]] + '-' +                                  // 85  // 93
            bth[buf[i++]] + bth[buf[i++]] + '-' +                                  // 86  // 94
            bth[buf[i++]] + bth[buf[i++]] + '-' +                                  // 87  // 95
            bth[buf[i++]] + bth[buf[i++]] + '-' +                                  // 88  // 96
            bth[buf[i++]] + bth[buf[i++]] +                                        // 89  // 97
            bth[buf[i++]] + bth[buf[i++]] +                                        // 90  // 98
            bth[buf[i++]] + bth[buf[i++]];                                         // 91  // 99
  }                                                                                // 92  // 100
                                                                                   // 93  // 101
  // **`v1()` - Generate time-based UUID**                                         // 94  // 102
  //                                                                               // 95  // 103
  // Inspired by https://github.com/LiosK/UUID.js                                  // 96  // 104
  // and http://docs.python.org/library/uuid.html                                  // 97  // 105
                                                                                   // 98  // 106
  // random #'s we need to init node and clockseq                                  // 99  // 107
  var _seedBytes = _rng();                                                         // 100
                                                                                   // 101
  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)      // 102
  var _nodeId = [                                                                  // 103
    _seedBytes[0] | 0x01,                                                          // 104
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]      // 105
  ];                                                                               // 106
                                                                                   // 107
  // Per 4.2.2, randomize (14 bit) clockseq                                        // 108
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;                   // 109
                                                                                   // 110
  // Previous uuid creation time                                                   // 111
  var _lastMSecs = 0, _lastNSecs = 0;                                              // 112
                                                                                   // 113
  // See https://github.com/broofa/node-uuid for API details                       // 114
  function v1(options, buf, offset) {                                              // 115
    var i = buf && offset || 0;                                                    // 116
    var b = buf || [];                                                             // 117
                                                                                   // 118
    options = options || {};                                                       // 119
                                                                                   // 120
    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;        // 121
                                                                                   // 122
    // UUID timestamps are 100 nano-second units since the Gregorian epoch,        // 123
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so           // 124
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'    // 125
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.     // 126
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();      // 127
                                                                                   // 128
    // Per 4.2.1.2, use count of uuid's generated during the current clock         // 129
    // cycle to simulate higher resolution clock                                   // 130
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;            // 131
                                                                                   // 132
    // Time since last uuid creation (in msecs)                                    // 133
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;                    // 134
                                                                                   // 135
    // Per 4.2.1.2, Bump clockseq on clock regression                              // 136
    if (dt < 0 && options.clockseq == null) {                                      // 137
      clockseq = clockseq + 1 & 0x3fff;                                            // 138
    }                                                                              // 139
                                                                                   // 140
    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new     // 141
    // time interval                                                               // 142
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {                 // 143
      nsecs = 0;                                                                   // 144
    }                                                                              // 145
                                                                                   // 146
    // Per 4.2.1.2 Throw error if too many uuids are requested                     // 147
    if (nsecs >= 10000) {                                                          // 148
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');         // 149
    }                                                                              // 150
                                                                                   // 151
    _lastMSecs = msecs;                                                            // 152
    _lastNSecs = nsecs;                                                            // 153
    _clockseq = clockseq;                                                          // 154
                                                                                   // 155
    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch                      // 156
    msecs += 12219292800000;                                                       // 157
                                                                                   // 158
    // `time_low`                                                                  // 159
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;                  // 160
    b[i++] = tl >>> 24 & 0xff;                                                     // 161
    b[i++] = tl >>> 16 & 0xff;                                                     // 162
    b[i++] = tl >>> 8 & 0xff;                                                      // 163
    b[i++] = tl & 0xff;                                                            // 164
                                                                                   // 165
    // `time_mid`                                                                  // 166
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;                           // 167
    b[i++] = tmh >>> 8 & 0xff;                                                     // 168
    b[i++] = tmh & 0xff;                                                           // 169
                                                                                   // 170
    // `time_high_and_version`                                                     // 171
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version                           // 172
    b[i++] = tmh >>> 16 & 0xff;                                                    // 173
                                                                                   // 174
    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)                   // 175
    b[i++] = clockseq >>> 8 | 0x80;                                                // 176
                                                                                   // 177
    // `clock_seq_low`                                                             // 178
    b[i++] = clockseq & 0xff;                                                      // 179
                                                                                   // 180
    // `node`                                                                      // 181
    var node = options.node || _nodeId;                                            // 182
    for (var n = 0; n < 6; n++) {                                                  // 183
      b[i + n] = node[n];                                                          // 184
    }                                                                              // 185
                                                                                   // 186
    return buf ? buf : unparse(b);                                                 // 187
  }                                                                                // 188
                                                                                   // 189
  // **`v4()` - Generate random UUID**                                             // 190
                                                                                   // 191
  // See https://github.com/broofa/node-uuid for API details                       // 192
  function v4(options, buf, offset) {                                              // 193
    // Deprecated - 'format' argument, as supported in v1.2                        // 194
    var i = buf && offset || 0;                                                    // 195
                                                                                   // 196
    if (typeof(options) == 'string') {                                             // 197
      buf = options == 'binary' ? new BufferClass(16) : null;                      // 198
      options = null;                                                              // 199
    }                                                                              // 200
    options = options || {};                                                       // 201
                                                                                   // 202
    var rnds = options.random || (options.rng || _rng)();                          // 203
                                                                                   // 204
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`               // 205
    rnds[6] = (rnds[6] & 0x0f) | 0x40;                                             // 206
    rnds[8] = (rnds[8] & 0x3f) | 0x80;                                             // 207
                                                                                   // 208
    // Copy bytes to buffer, if provided                                           // 209
    if (buf) {                                                                     // 210
      for (var ii = 0; ii < 16; ii++) {                                            // 211
        buf[i + ii] = rnds[ii];                                                    // 212
      }                                                                            // 213
    }                                                                              // 214
                                                                                   // 215
    return buf || unparse(rnds);                                                   // 216
  }                                                                                // 217
                                                                                   // 218
  // Export public API                                                             // 219
  var uuid = v4;                                                                   // 220
  uuid.v1 = v1;                                                                    // 221
  uuid.v4 = v4;                                                                    // 222
  uuid.parse = parse;                                                              // 223
  uuid.unparse = unparse;                                                          // 224
  uuid.BufferClass = BufferClass;                                                  // 225
                                                                                   // 226
  if (typeof define === 'function' && define.amd) {                                // 227
    // Publish as AMD module                                                       // 228
    define(function() {return uuid;});                                             // 229
  } else if (typeof(module) != 'undefined' && module.exports) {                    // 230
    // Publish as node.js module                                                   // 231
    module.exports = uuid;                                                         // 232
  } else {                                                                         // 233
    // Publish as global (in browsers)                                             // 234
    var _previousRoot = _global.uuid;                                              // 235
                                                                                   // 236
    // **`noConflict()` - (browser only) to reset global 'uuid' var**              // 237
    uuid.noConflict = function() {                                                 // 238
      _global.uuid = _previousRoot;                                                // 239
      return uuid;                                                                 // 240
    };                                                                             // 241
                                                                                   // 242
    _global.uuid = uuid;                                                           // 243
  }                                                                                // 244
}).call(this);                                                                     // 245
/////////////////////////////////////////////////////////////////////////////////////     // 254
                                                                                          // 255
}).call(this);                                                                            // 256
                                                                                          // 257
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jaywon:meteor-node-uuid'] = {};

})();

//# sourceMappingURL=jaywon_meteor-node-uuid.js.map
