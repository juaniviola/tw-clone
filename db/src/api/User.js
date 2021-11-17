import { hash, compare } from 'bcryptjs';
import { User } from '../models';

const saveUser = async ({
  username = null,
  password = null,
  fullName = null,
  email = null,
} = {}) => {
  const hashPassword = await hash(password, 8);

  const user = new User({
    username,
    password: hashPassword,
    fullName,
    email,
  });

  return user.save();
};

const comparePassword = async ({ id = null, password = null } = {}) => {
  const findUser = await User.findOne({ _id: id });

  return compare(password, findUser.password);
};

const getById = (id) => User
  .findOne({ _id: id })
  .select('_id username fullName email');

const getByUsername = (username) => User
  .findOne({ username: username.toString().trim() })
  .select('_id username fullName email');

const getUsersByUsername = (username) => User
  .find({ username: new RegExp(username.toString().trim(), 'i') })
  .select('_id username fullName email');

const addFollower = async ({ userFromId = null, userToId = null } = {}) => Promise.all([
  User.findOneAndUpdate({ _id: userFromId }, {
    $push: { following: userToId },
  }),

  User.findOneAndUpdate({ _id: userToId }, {
    $push: { followers: userFromId },
  }),
]);

const deleteFollower = async ({ userFromId = null, userToId = null } = {}) => Promise.all([
  User.findOneAndUpdate({ _id: userFromId }, {
    $pull: { following: userToId },
  }),

  User.findOneAndUpdate({ _id: userToId }, {
    $pull: { followers: userFromId },
  }),
]);

const getFollowers = async (id) => User
  .findOne({ _id: id })
  .select('username')
  .populate({ path: 'following', select: { _id: 1, username: 1, fullName: 1 } })
  .populate({ path: 'followers', select: { _id: 1, username: 1, fullName: 1 } });

export {
  saveUser,
  comparePassword,
  addFollower,
  deleteFollower,
  getById,
  getByUsername,
  getUsersByUsername,
  getFollowers,
};
