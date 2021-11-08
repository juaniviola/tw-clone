"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongooseUniqueValidator = _interopRequireDefault(require("mongoose-unique-validator"));

var _validator = _interopRequireDefault(require("validator"));

var userSchema = new _mongoose["default"].Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: function validate(value) {
      return _validator["default"].isEmail(value);
    }
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function validator(value) {
        return value.length >= 8;
      },
      message: function message() {
        return 'Password length should be greather or equal than 8';
      }
    }
  },
  followers: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  }]
});
userSchema.plugin(_mongooseUniqueValidator["default"]);

var _default = _mongoose["default"].model('User', userSchema);

exports["default"] = _default;