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

var saveUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _ref2,
        _ref2$username,
        username,
        _ref2$password,
        password,
        _ref2$fullName,
        fullName,
        _ref2$email,
        email,
        hashPassword,
        user,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$username = _ref2.username, username = _ref2$username === void 0 ? null : _ref2$username, _ref2$password = _ref2.password, password = _ref2$password === void 0 ? null : _ref2$password, _ref2$fullName = _ref2.fullName, fullName = _ref2$fullName === void 0 ? null : _ref2$fullName, _ref2$email = _ref2.email, email = _ref2$email === void 0 ? null : _ref2$email;
            _context.next = 3;
            return (0, _bcryptjs.hash)(password, 8);

          case 3:
            hashPassword = _context.sent;
            user = new _models.User({
              username: username,
              password: hashPassword,
              fullName: fullName,
              email: email
            });
            return _context.abrupt("return", user.save());

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function saveUser() {
    return _ref.apply(this, arguments);
  };
}();

exports.saveUser = saveUser;

var comparePassword = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var _ref4,
        _ref4$id,
        id,
        _ref4$password,
        password,
        findUser,
        _args2 = arguments;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref4 = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {}, _ref4$id = _ref4.id, id = _ref4$id === void 0 ? null : _ref4$id, _ref4$password = _ref4.password, password = _ref4$password === void 0 ? null : _ref4$password;
            _context2.next = 3;
            return _models.User.findOne({
              _id: id
            });

          case 3:
            findUser = _context2.sent;
            return _context2.abrupt("return", (0, _bcryptjs.compare)(password, findUser.password));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function comparePassword() {
    return _ref3.apply(this, arguments);
  };
}();

exports.comparePassword = comparePassword;

var getById = function getById(id) {
  return _models.User.findOne({
    _id: id
  }).select('_id username fullName email');
};

exports.getById = getById;

var getByUsername = function getByUsername(username) {
  return _models.User.findOne({
    username: username.toString().trim()
  }).select('_id username fullName email');
};

exports.getByUsername = getByUsername;

var getUsersByUsername = function getUsersByUsername(username) {
  return _models.User.find({
    username: new RegExp(username.toString().trim(), 'i')
  }).select('_id username fullName email');
};

exports.getUsersByUsername = getUsersByUsername;

var addFollower = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var _ref6,
        _ref6$userFromId,
        userFromId,
        _ref6$userToId,
        userToId,
        _args3 = arguments;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref6 = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref6$userFromId = _ref6.userFromId, userFromId = _ref6$userFromId === void 0 ? null : _ref6$userFromId, _ref6$userToId = _ref6.userToId, userToId = _ref6$userToId === void 0 ? null : _ref6$userToId;
            return _context3.abrupt("return", Promise.all([_models.User.findOneAndUpdate({
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

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function addFollower() {
    return _ref5.apply(this, arguments);
  };
}();

exports.addFollower = addFollower;

var deleteFollower = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _ref8,
        _ref8$userFromId,
        userFromId,
        _ref8$userToId,
        userToId,
        _args4 = arguments;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _ref8 = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {}, _ref8$userFromId = _ref8.userFromId, userFromId = _ref8$userFromId === void 0 ? null : _ref8$userFromId, _ref8$userToId = _ref8.userToId, userToId = _ref8$userToId === void 0 ? null : _ref8$userToId;
            return _context4.abrupt("return", Promise.all([_models.User.findOneAndUpdate({
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

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function deleteFollower() {
    return _ref7.apply(this, arguments);
  };
}();

exports.deleteFollower = deleteFollower;

var getFollowers = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(id) {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", _models.User.findOne({
              _id: id
            }).select('username').populate({
              path: 'following',
              select: {
                _id: 1,
                username: 1,
                fullName: 1
              }
            }).populate({
              path: 'followers',
              select: {
                _id: 1,
                username: 1,
                fullName: 1
              }
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getFollowers(_x) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getFollowers = getFollowers;