"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveUser = exports.getUsersByUsername = exports.getFollowers = exports.getByUsername = exports.getById = exports.deleteFollower = exports.comparePassword = exports.addFollower = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = require("bcryptjs");

var _models = require("../models");

var saveUser = function saveUser(_ref) {
  var username = _ref.username,
      password = _ref.password,
      fullName = _ref.fullName,
      email = _ref.email;
  if (!password || !username || !fullName || !email) throw Error('Invalid parameters');

  var hashPassword = function hashPassword(pass) {
    return (0, _bcryptjs.hashSync)(pass, 8);
  };

  var user = new _models.User({
    username: username,
    password: hashPassword(password),
    fullName: fullName,
    email: email
  });
  return user.save();
};

exports.saveUser = saveUser;

var comparePassword = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref2) {
    var id, password, findUser;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            id = _ref2.id, password = _ref2.password;

            if (!(!id || !password || typeof password !== 'string')) {
              _context.next = 3;
              break;
            }

            throw Error('Invalid parameters');

          case 3:
            _context.next = 5;
            return _models.User.findOne({
              _id: id
            });

          case 5:
            findUser = _context.sent;
            return _context.abrupt("return", (0, _bcryptjs.compare)(password, findUser.password));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function comparePassword(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.comparePassword = comparePassword;

var getById = function getById(id) {
  if (!id) throw Error('Invalid parameter');
  return _models.User.findOne({
    _id: id
  }).select('_id username fullName email');
};

exports.getById = getById;

var getByUsername = function getByUsername(username) {
  if (!username) throw Error('Invalid parameter');
  return _models.User.findOne({
    username: username.toString().trim()
  }).select('_id username fullName email');
};

exports.getByUsername = getByUsername;

var getUsersByUsername = function getUsersByUsername(username) {
  if (!username) throw Error('Invalid parameter');
  return _models.User.find({
    username: new RegExp(username.toString().trim(), 'i')
  }).select('_id username fullName email');
};

exports.getUsersByUsername = getUsersByUsername;

var addFollower = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref4) {
    var userFromId, userToId;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userFromId = _ref4.userFromId, userToId = _ref4.userToId;

            if (!(!userFromId || !userToId)) {
              _context2.next = 3;
              break;
            }

            throw Error('Invalid parameters');

          case 3:
            return _context2.abrupt("return", Promise.all([_models.User.findOneAndUpdate({
              _id: userFromId
            }, {
              $push: {
                following: userToId
              }
            }), _models.User.findOneAndUpdate({
              _id: userToId
            }, {
              $push: {
                followers: userFromId
              }
            })]));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function addFollower(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.addFollower = addFollower;

var deleteFollower = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref6) {
    var userFromId, userToId;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userFromId = _ref6.userFromId, userToId = _ref6.userToId;

            if (!(!userFromId || !userToId)) {
              _context3.next = 3;
              break;
            }

            throw Error('Invalid parameters');

          case 3:
            return _context3.abrupt("return", Promise.all([_models.User.findOneAndUpdate({
              _id: userFromId
            }, {
              $pull: {
                following: userToId
              }
            }), _models.User.findOneAndUpdate({
              _id: userToId
            }, {
              $pull: {
                followers: userFromId
              }
            })]));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function deleteFollower(_x3) {
    return _ref7.apply(this, arguments);
  };
}();

exports.deleteFollower = deleteFollower;

var getFollowers = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", _models.User.findOne({
              _id: id
            }).select('username').populate({
              path: 'following',
              select: {
                id: 1,
                username: 1,
                fullName: 1
              }
            }).populate({
              path: 'followers',
              select: {
                id: 1,
                username: 1,
                fullName: 1
              }
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getFollowers(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getFollowers = getFollowers;