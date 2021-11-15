"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTweet = exports.updateAnswer = exports.tweetByFollowingUsers = exports.saveTweet = exports.getByUser = exports.getById = exports.getByHashtags = exports.favorite = exports.deleteTweet = exports.deleteAnswer = exports.addAnswer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _models = require("../models");

var _utils = _interopRequireDefault(require("../utils"));

var saveTweet = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(payload) {
    var user, description, tweet;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = payload.user, description = payload.description;

            if (!(!user || !description)) {
              _context.next = 3;
              break;
            }

            throw Error('Invalid parameters');

          case 3:
            if (_mongoose["default"].Types.ObjectId.isValid(user)) {
              _context.next = 5;
              break;
            }

            throw Error('Invalid user id');

          case 5:
            tweet = new _models.Tweet({
              user: user,
              description: description,
              createdAt: new Date(),
              hashtags: _utils["default"].getHashtag(description),
              mentions: _utils["default"].getMentions(description)
            });
            return _context.abrupt("return", tweet.save());

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function saveTweet(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.saveTweet = saveTweet;

var getById = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
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
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'favs',
              options: {
                select: {
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'answers.user',
              options: {
                select: {
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

  return function getById(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getById = getById;

var getByHashtags = function getByHashtags(hashtag) {
  var htx = hashtag[0] === '#' ? hashtag : '#'.concat(hashtag);
  return _models.Tweet.find({
    hashtags: htx.toLowerCase()
  }).sort({
    createdAt: -1
  }).populate({
    path: 'user',
    options: {
      select: {
        username: 1,
        fullName: 1
      }
    }
  }).populate({
    path: 'favs',
    options: {
      select: {
        username: 1,
        fullName: 1
      }
    }
  }).populate({
    path: 'answers.user',
    options: {
      select: {
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
        username: 1,
        fullName: 1
      }
    }
  }).populate({
    path: 'favs',
    options: {
      select: {
        username: 1,
        fullName: 1
      }
    }
  }).populate({
    path: 'answers.user',
    options: {
      select: {
        username: 1,
        fullName: 1
      }
    }
  });
};

exports.getByUser = getByUser;

var favorite = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
    var tweetId, fav, userId, isFav;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            tweetId = _ref3.tweetId, fav = _ref3.fav, userId = _ref3.userId;

            if (!(!_mongoose["default"].Types.ObjectId.isValid(userId) || !_mongoose["default"].Types.ObjectId.isValid(tweetId))) {
              _context3.next = 3;
              break;
            }

            throw Error('Invalid id');

          case 3:
            isFav = fav ? {
              $push: {
                favs: userId
              }
            } : {
              $pull: {
                favs: userId
              }
            };
            return _context3.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: tweetId
            }, isFav, {
              "new": true
            }));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function favorite(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.favorite = favorite;

var updateTweet = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref5) {
    var id, description;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = _ref5.id, description = _ref5.description;

            if (description) {
              _context4.next = 3;
              break;
            }

            throw Error('Invalid parameters');

          case 3:
            if (_mongoose["default"].Types.ObjectId.isValid(id)) {
              _context4.next = 5;
              break;
            }

            throw Error('Invalid id');

          case 5:
            return _context4.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: id
            }, {
              description: description,
              mentions: _utils["default"].getMentions(description),
              hashtags: _utils["default"].getHashtag(description)
            }, {
              "new": true
            }));

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateTweet(_x4) {
    return _ref6.apply(this, arguments);
  };
}();

exports.updateTweet = updateTweet;

var deleteTweet = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", _models.Tweet.findOneAndRemove({
              _id: id
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function deleteTweet(_x5) {
    return _ref7.apply(this, arguments);
  };
}();

exports.deleteTweet = deleteTweet;

var addAnswer = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref8) {
    var tweetId, userId, description;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            tweetId = _ref8.tweetId, userId = _ref8.userId, description = _ref8.description;

            if (description) {
              _context6.next = 3;
              break;
            }

            throw Error('Invalid parameters');

          case 3:
            if (!(!_mongoose["default"].Types.ObjectId.isValid(tweetId) || !_mongoose["default"].Types.ObjectId.isValid(userId))) {
              _context6.next = 5;
              break;
            }

            throw Error('Invalid id');

          case 5:
            return _context6.abrupt("return", _models.Tweet.findOneAndUpdate({
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

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function addAnswer(_x6) {
    return _ref9.apply(this, arguments);
  };
}();

exports.addAnswer = addAnswer;

var deleteAnswer = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref10) {
    var tweetId, answerId;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            tweetId = _ref10.tweetId, answerId = _ref10.answerId;

            if (!(!_mongoose["default"].Types.ObjectId.isValid(tweetId) || !_mongoose["default"].Types.ObjectId.isValid(answerId))) {
              _context7.next = 3;
              break;
            }

            throw Error('Invalid ids');

          case 3:
            return _context7.abrupt("return", _models.Tweet.findOneAndUpdate({
              _id: tweetId
            }, {
              $pull: {
                answers: {
                  _id: answerId
                }
              }
            }));

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function deleteAnswer(_x7) {
    return _ref11.apply(this, arguments);
  };
}();

exports.deleteAnswer = deleteAnswer;

var updateAnswer = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref12) {
    var tweetId, answerId, description;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            tweetId = _ref12.tweetId, answerId = _ref12.answerId, description = _ref12.description;

            if (!(!_mongoose["default"].Types.ObjectId.isValid(tweetId) || !_mongoose["default"].Types.ObjectId.isValid(answerId))) {
              _context8.next = 3;
              break;
            }

            throw Error('Invalid ids');

          case 3:
            return _context8.abrupt("return", _models.Tweet.findOneAndUpdate({
              'answers._id': answerId
            }, {
              $set: {
                'answers.$.description': description
              }
            }, {
              "new": true
            }));

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function updateAnswer(_x8) {
    return _ref13.apply(this, arguments);
  };
}();

exports.updateAnswer = updateAnswer;

var tweetByFollowingUsers = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var _ref15,
        _ref15$id,
        id,
        _ref15$offset,
        offset,
        _ref15$limit,
        limit,
        user,
        _args9 = arguments;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _ref15 = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {}, _ref15$id = _ref15.id, id = _ref15$id === void 0 ? null : _ref15$id, _ref15$offset = _ref15.offset, offset = _ref15$offset === void 0 ? 0 : _ref15$offset, _ref15$limit = _ref15.limit, limit = _ref15$limit === void 0 ? 30 : _ref15$limit;

            if (_mongoose["default"].Types.ObjectId.isValid(id)) {
              _context9.next = 3;
              break;
            }

            throw Error('Invalid id');

          case 3:
            _context9.next = 5;
            return _models.User.findOne({
              _id: id
            });

          case 5:
            user = _context9.sent;

            if (user) {
              _context9.next = 8;
              break;
            }

            throw Error('User not found');

          case 8:
            return _context9.abrupt("return", _models.Tweet.find({
              user: {
                $in: user.following
              }
            }).sort({
              createdAt: -1
            }).skip(offset).limit(limit).populate({
              path: 'user',
              options: {
                select: {
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'favs',
              options: {
                select: {
                  username: 1,
                  fullName: 1
                }
              }
            }).populate({
              path: 'answers.user',
              options: {
                select: {
                  username: 1,
                  fullName: 1
                }
              }
            }));

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function tweetByFollowingUsers() {
    return _ref14.apply(this, arguments);
  };
}();

exports.tweetByFollowingUsers = tweetByFollowingUsers;