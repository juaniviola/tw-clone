"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTweet = exports.updateAnswer = exports.tweetByFollowingUsers = exports.saveTweet = exports.getByUser = exports.getByIdPopulated = exports.getById = exports.getByHashtags = exports.favorite = exports.deleteTweet = exports.deleteAnswer = exports.addAnswer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = require("../models");

var _utils = _interopRequireDefault(require("../utils"));

var getHashtag = _utils["default"].getHashtag,
    getMentions = _utils["default"].getMentions;

var saveTweet = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _ref2,
        _ref2$user,
        user,
        _ref2$description,
        description,
        tweet,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$user = _ref2.user, user = _ref2$user === void 0 ? null : _ref2$user, _ref2$description = _ref2.description, description = _ref2$description === void 0 ? null : _ref2$description;
            tweet = new _models.Tweet({
              user: user,
              description: description,
              createdAt: new Date(),
              hashtags: getHashtag(description),
              mentions: getMentions(description)
            });
            return _context.abrupt("return", tweet.save());

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function saveTweet() {
    return _ref.apply(this, arguments);
  };
}();

exports.saveTweet = saveTweet;

var getById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", _models.Tweet.findOne({
              _id: id
            }).sort({
              createdAt: -1
            }).populate({
              path: 'user',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getById(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getById = getById;

var getByIdPopulated = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", _models.Tweet.findOne({
              _id: id
            }).sort({
              createdAt: -1
            }).populate({
              path: 'user',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'favs',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'answers.user',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getByIdPopulated(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getByIdPopulated = getByIdPopulated;

var getByHashtags = function getByHashtags(hashtag) {
  var htx = (hashtag[0] === '#' ? hashtag : '#'.concat(hashtag)).toLowerCase();
  return _models.Tweet.find({
    hashtags: htx
  }).sort({
    createdAt: -1
  }).populate({
    path: 'user',
    options: {
      select: {
        _id: 1,
        username: 1,
        fullName: 1
      }
    }
  }).populate({
    path: 'favs',
    options: {
      select: {
        _id: 1,
        username: 1,
        fullName: 1
      }
    }
  }).populate({
    path: 'answers.user',
    options: {
      select: {
        _id: 1,
        username: 1,
        fullName: 1
      }
    }
  });
};

exports.getByHashtags = getByHashtags;

var getByUser = function getByUser(id) {
  return _models.Tweet.find({
    user: id
  }).sort({
    createdAt: -1
  }).populate({
    path: 'user',
    options: {
      select: {
        _id: 1,
        username: 1,
        fullName: 1
      }
    }
  });
};

exports.getByUser = getByUser;

var favorite = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _ref6,
        _ref6$tweetId,
        tweetId,
        _ref6$fav,
        fav,
        _ref6$userId,
        userId,
        isFav,
        _args4 = arguments;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _ref6 = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {}, _ref6$tweetId = _ref6.tweetId, tweetId = _ref6$tweetId === void 0 ? null : _ref6$tweetId, _ref6$fav = _ref6.fav, fav = _ref6$fav === void 0 ? false : _ref6$fav, _ref6$userId = _ref6.userId, userId = _ref6$userId === void 0 ? null : _ref6$userId;
            isFav = fav ? {
              $push: {
                favs: userId
              }
            } : {
              $pull: {
                favs: userId
              }
            };
            return _context4.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: tweetId
            }, isFav, {
              "new": true
            }));

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function favorite() {
    return _ref5.apply(this, arguments);
  };
}();

exports.favorite = favorite;

var updateTweet = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var _ref8,
        _ref8$id,
        id,
        _ref8$description,
        description,
        _args5 = arguments;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _ref8 = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : {}, _ref8$id = _ref8.id, id = _ref8$id === void 0 ? null : _ref8$id, _ref8$description = _ref8.description, description = _ref8$description === void 0 ? null : _ref8$description;
            return _context5.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: id
            }, {
              description: description,
              mentions: getMentions(description),
              hashtags: getHashtag(description)
            }, {
              "new": true
            }));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function updateTweet() {
    return _ref7.apply(this, arguments);
  };
}();

exports.updateTweet = updateTweet;

var deleteTweet = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", _models.Tweet.findOneAndRemove({
              _id: id
            }));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function deleteTweet(_x3) {
    return _ref9.apply(this, arguments);
  };
}();

exports.deleteTweet = deleteTweet;

var addAnswer = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var _ref11,
        _ref11$tweetId,
        tweetId,
        _ref11$userId,
        userId,
        _ref11$description,
        description,
        _args7 = arguments;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _ref11 = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {}, _ref11$tweetId = _ref11.tweetId, tweetId = _ref11$tweetId === void 0 ? null : _ref11$tweetId, _ref11$userId = _ref11.userId, userId = _ref11$userId === void 0 ? null : _ref11$userId, _ref11$description = _ref11.description, description = _ref11$description === void 0 ? null : _ref11$description;
            return _context7.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: tweetId
            }, {
              $push: {
                answers: {
                  user: userId,
                  description: description,
                  createdAt: new Date()
                }
              }
            }, {
              "new": true
            }));

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function addAnswer() {
    return _ref10.apply(this, arguments);
  };
}();

exports.addAnswer = addAnswer;

var deleteAnswer = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var _ref13,
        _ref13$tweetId,
        tweetId,
        _ref13$answerId,
        answerId,
        _args8 = arguments;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _ref13 = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {}, _ref13$tweetId = _ref13.tweetId, tweetId = _ref13$tweetId === void 0 ? null : _ref13$tweetId, _ref13$answerId = _ref13.answerId, answerId = _ref13$answerId === void 0 ? null : _ref13$answerId;
            return _context8.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: tweetId
            }, {
              $pull: {
                answers: {
                  _id: answerId
                }
              }
            }));

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function deleteAnswer() {
    return _ref12.apply(this, arguments);
  };
}();

exports.deleteAnswer = deleteAnswer;

var updateAnswer = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _ref15,
        _ref15$answerId,
        answerId,
        _ref15$description,
        description,
        _args9 = arguments;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _ref15 = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {}, _ref15$answerId = _ref15.answerId, answerId = _ref15$answerId === void 0 ? null : _ref15$answerId, _ref15$description = _ref15.description, description = _ref15$description === void 0 ? null : _ref15$description;
            return _context9.abrupt("return", _models.Tweet.findOneAndUpdate({
              'answers._id': answerId
            }, {
              $set: {
                'answers.$.description': description
              }
            }, {
              "new": true
            }));

          case 2:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function updateAnswer() {
    return _ref14.apply(this, arguments);
  };
}();

exports.updateAnswer = updateAnswer;

var tweetByFollowingUsers = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var _ref17,
        _ref17$id,
        id,
        _ref17$offset,
        offset,
        _ref17$limit,
        limit,
        user,
        _args10 = arguments;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _ref17 = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : {}, _ref17$id = _ref17.id, id = _ref17$id === void 0 ? null : _ref17$id, _ref17$offset = _ref17.offset, offset = _ref17$offset === void 0 ? 0 : _ref17$offset, _ref17$limit = _ref17.limit, limit = _ref17$limit === void 0 ? 30 : _ref17$limit;
            _context10.next = 3;
            return _models.User.findOne({
              _id: id
            });

          case 3:
            user = _context10.sent;

            if (user) {
              _context10.next = 6;
              break;
            }

            throw Error('User not found');

          case 6:
            return _context10.abrupt("return", _models.Tweet.find({
              user: {
                $in: user.following
              }
            }).sort({
              createdAt: -1
            }).skip(offset).limit(limit).populate({
              path: 'user',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'favs',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'answers.user',
              options: {
                select: {
                  _id: 1,
                  username: 1,
                  fullName: 1
                }
              }
            }));

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function tweetByFollowingUsers() {
    return _ref16.apply(this, arguments);
  };
}();

exports.tweetByFollowingUsers = tweetByFollowingUsers;