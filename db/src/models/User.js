import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => validator.isEmail(value),
  },

  fullName: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  secure: [{
    type: String,
  }],
});

export default mongoose.model('User', userSchema);
