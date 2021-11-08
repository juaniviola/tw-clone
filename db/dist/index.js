"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Tweet", {
  enumerable: true,
  get: function get() {
    return _api.Tweet;
  }
});
Object.defineProperty(exports, "User", {
  enumerable: true,
  get: function get() {
    return _api.User;
  }
});
exports.connect = connect;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _api = require("./api");

function connect(uri) {
  return _mongoose["default"].connect(uri, {
    useNewUrlParser: true
  });
}