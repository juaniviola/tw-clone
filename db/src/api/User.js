import { hashSync, compare } from 'bcryptjs';
import { User } from '../models';

const saveUser = (payload) => {
  if (!payload.password || !payload.username
    || !payload.fullName || !payload.email || payload.id) throw Error('Invalid parameters');

  const hashPassword = (password) => hashSync(password, 8);
  const copyPayload = Object.assign(payload, {
    password: hashPassword(payload.password),
  });

  const user = new User(copyPayload);

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
    .select('_id id username fullName email');
};

const getByUsername = (usname) => {
  if (!usname || typeof usname !== 'string') throw Error('Invalid parameter');
  const username = usname.toString().trim();

  return User.findOne({ username })
    .select('_id id username fullName email');
};

const getUsersByUsername = (usname) => {
  if (!usname || typeof usname !== 'string') throw Error('Invalid parameter');
  const username = usname.toString().trim();

  return User.find({ username: new RegExp(username, 'i') })
    .select('_id id username fullName email');
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
  .populate({ path: 'following', select: { id: 1, username: 1, fullName: 1 } })
  .populate({ path: 'followers', select: { id: 1, username: 1, fullName: 1 } });

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
