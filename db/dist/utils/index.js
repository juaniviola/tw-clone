"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var methods = {
  getHashtag: function getHashtag(text) {
    if (typeof text !== 'string') throw Error('Invalid parameter');
    var hashtag = text.match(/#\w+/g);
    if (hashtag) return hashtag.map(function (x) {
      return x.toLowerCase();
    });
    return hashtag;
  },
  getMentions: function getMentions(text) {
    if (typeof text !== 'string') throw Error('Invalid parameter');
    return text.match(/@\w+/g);
  }
};
var _default = methods;
exports["default"] = _default;