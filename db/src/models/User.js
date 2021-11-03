import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },

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
    validate: {
      validator: (value) => value.length >= 8,
      message: () => 'Password length should be greather or equal than 8',
    },
  },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
