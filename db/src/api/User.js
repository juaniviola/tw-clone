import { hashSync, compareSync } from 'bcryptjs';
import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { User } from '../models';

async function checkSecure(id, secure) {
  const user = await User.findOne({ _id: id });
  if (!user || !user.secure || user.secure.length === 0) throw Error('Invalid parameters');

  return !!user.secure.find((sec) => sec === secure);
}

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

const comparePassword = async (user) => {
  // eslint-disable-next-line no-underscore-dangle
  const findUser = await User.findOne({ _id: user._id });

  if (!compareSync(user.password, findUser.password)) throw Error('Incorrect password');

  return true;
};

const getById = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Invalid id');

  return User
    .findOne({ _id: id })
    .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
};

const getUserByUsername = (usname) => {
  const username = usname.toString().trim();

  return User
    .findOne({ username })
    .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
};

const getUsersByUsername = (usname) => {
  const username = usname.toString().trim();

  return User
    .find({ username: new RegExp(username, 'i') })
    .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
};

const addFollower = async (payload) => {
  const { userFromId, userFromSecure, userToId } = payload.follow;
  if (!userFromId || !userFromSecure || !userToId) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(userFromId)
    || !mongoose.Types.ObjectId.isValid(userToId)) throw Error('Invalid id');

  const isSecure = await checkSecure(userFromId, userFromSecure);
  if (!isSecure) throw Error('Unhauthorized');

  await User.findOneAndUpdate({ _id: userFromId }, {
    $push: { following: userToId },
  });

  await User.findOneAndUpdate({ _id: userToId }, {
    $push: { followers: userFromId },
  });

  return User
    .findOne({ _id: userFromId })
    .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
};

const deleteFollower = async (payload) => {
  const { userFromId, userFromSecure, userToId } = payload.follow;
  if (!userFromId || !userFromSecure || !userToId) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(userFromId)
    || !mongoose.Types.ObjectId.isValid(userToId)) throw Error('Invalid id');

  const isSecure = await checkSecure(userFromId, userFromSecure);
  if (!isSecure) throw Error('Unhauthorized');

  await User.findOneAndUpdate({ _id: userFromId }, {
    $pull: { following: userToId },
  });

  await User.findOneAndUpdate({ _id: userToId }, {
    $pull: { followers: userFromId },
  });

  return User
    .findOne({ _id: userFromId })
    .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
};

const setSecure = (_id, secure) => User.findOneAndUpdate({ _id }, { $push: { secure } });

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
  getUserByUsername,
  getUsersByUsername,
  setSecure,
  signin,
  logout,
};
