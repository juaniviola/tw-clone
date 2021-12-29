import mongoose, { Schema } from 'mongoose';

const tweetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  description: {
    type: String,
    required: true,
    validate: (value) => value.length <= 280,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  favs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  retweets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  hashtags: {
    type: Array,
    default: [],
  },

  mentions: {
    type: Array,
    default: [],
  },

  answers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    description: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
    },
  }],
});

export default mongoose.model('Tweet', tweetSchema);
