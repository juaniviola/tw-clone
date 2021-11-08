"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "api", {
  enumerable: true,
  get: function get() {
    return _api["default"];
  }
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _api = _interopRequireDefault(require("./api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(uri) {
  return _mongoose["default"].connect(uri, {
    useNewUrlParser: true
  });
};

exports["default"] = _default;