import { hashSync, compare } from 'bcryptjs';
import { User } from '../models';

const saveUser = ({
  username,
  password,
  fullName,
  email,
}) => {
  if (!password || !username || !fullName || !email) throw Error('Invalid parameters');
  const hashPassword = (pass) => hashSync(pass, 8);

  const user = new User({
    username,
    password: hashPassword(password),
    fullName,
    email,
  });

  return user.save();
};

const comparePassword = async ({ id, password }) => {
  if (!id || !password || typeof password !== 'string') throw Error('Invalid parameters');

  const findUser = await User.findOne({ _id: id });

  return compare(password, findUser.password);
};

const getById = (id) => {
  if (!id) throw Error('Invalid parameter');

  return User.findOne({ _id: id })
    .select('_id username fullName email');
};

const getByUsername = (username) => {
  if (!username) throw Error('Invalid parameter');

  return User.findOne({ username: username.toString().trim() })
    .select('_id username fullName email');
};

const getUsersByUsername = (username) => {
  if (!username) throw Error('Invalid parameter');

  return User.find({ username: new RegExp(username.toString().trim(), 'i') })
    .select('_id username fullName email');
};

const addFollower = async ({ userFromId, userToId }) => {
  if (!userFromId || !userToId) throw Error('Invalid parameters');

  return Promise.all([
    User.findOneAndUpdate({ _id: userFromId }, {
      $push: { following: userToId },
    }),

    User.findOneAndUpdate({ _id: userToId }, {
      $push: { followers: userFromId },
    }),
  ]);
};

const deleteFollower = async ({ userFromId, userToId }) => {
  if (!userFromId || !userToId) throw Error('Invalid parameters');

  return Promise.all([
    User.findOneAndUpdate({ _id: userFromId }, {
      $pull: { following: userToId },
    }),

    User.findOneAndUpdate({ _id: userToId }, {
      $pull: { followers: userFromId },
    }),
  ]);
};

const getFollowers = async (id) => User.findOne({ _id: id })
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
