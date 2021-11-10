"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToObjectId = exports.objectIdToString = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var objectId = _mongoose["default"].Types.ObjectId;

var stringToObjectId = function stringToObjectId(id) {
  return objectId(id);
};

exports.stringToObjectId = stringToObjectId;

var objectIdToString = function objectIdToString(str) {
  return objectId.isValid(str) ? str.toString() : null;
};

exports.objectIdToString = objectIdToString;