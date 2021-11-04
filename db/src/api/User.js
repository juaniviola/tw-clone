import { hashSync, compareSync, compare } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { User } from '../models';

const saveUser = (payload) => {
  if (!payload.password || !payload.username
    || !payload.fullName || !payload.email || payload.id) throw Error('Invalid parameters');

  const hashPassword = (password) => hashSync(password, 8);
  const copyPayload = Object.assign(payload, {
    id: uuid(),
    password: hashPassword(payload.password),
  });

  const user = new User(copyPayload);

  return user.save();
};

const comparePassword = async ({ id, password }) => {
  if (!id || typeof id !== 'string' || !password || typeof password !== 'string') throw Error('Invalid parameters');

  const findUser = await User.findOne({ id });

  return compare(password, findUser.password);
};

const getById = (id) => {
  if (!id || typeof id !== 'string') throw Error('Invalid parameter');

  return User.findOne({ id });
};

const getByUsername = (usname) => {
  if (!usname || typeof usname !== 'string') throw Error('Invalid parameter');
  const username = usname.toString().trim();

  return User.findOne({ username });
};

const getUsersByUsername = (usname) => {
  if (!usname || typeof usname !== 'string') throw Error('Invalid parameter');
  const username = usname.toString().trim();

  return User.find({ username: new RegExp(username, 'i') });
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
  .populate({ path: 'following', select: { id: 1, username: 1, fullName: 1 } })
  .populate({ path: 'followers', select: { id: 1, username: 1, fullName: 1 } });

const signin = async (payload) => {
  const { username, password } = payload.user;
  if (!username || !password) throw Error('Invalid parameters');

  const usname = username.toString().trim();
  const findUser = await User.findOne({ username: usname });
  if (!findUser) throw Error('User not found');

  if (!compareSync(password, findUser.password)) throw Error('User and password do not match');

  const secureCode = uuid();

  // eslint-disable-next-line no-underscore-dangle
  await User.findOneAndUpdate({ _id: findUser._id }, {
    $push: { secure: secureCode },
  });

  return {
    user: findUser,
    secure: secureCode,
  };
};

const logout = async (payload) => {
  const { userId } = payload.logout;

  await User.findOneAndUpdate({ _id: userId }, {
    $pull: { secure: [] },
  });

  return 'success';
};

export {
  saveUser,
  comparePassword,
  addFollower,
  deleteFollower,
  getById,
  getByUsername,
  getUsersByUsername,
  getFollowers,
  signin,
  logout,
};
