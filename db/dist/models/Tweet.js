"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var tweetSchema = new _mongoose.Schema({
  user: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    validate: function validate(value) {
      return value.length <= 280;
    }
  },
  createdAt: {
    type: Date,
    "default": new Date()
  },
  favs: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User'
  }],
  hashtags: {
    type: Array,
    "default": []
  },
  mentions: {
    type: Array,
    "default": []
  },
  answers: [{
    user: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date
    }
  }]
});

var _default = _mongoose["default"].model('Tweet', tweetSchema);

exports["default"] = _default;