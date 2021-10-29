import { hashSync, compareSync } from 'bcryptjs';
import mongoose from 'mongoose';
import uuid from 'uuid/v4';
import { User } from '../models';

async function checkSecure(id, secure) {
  const user = await User.findOne({ _id: id });
  if (!user || !user.secure || user.secure.length === 0) throw Error('Invalid parameters');

  return !!user.secure.find((sec) => sec === secure);
}

const methods = {
  saveUser(payload) {
    if (!payload.password || !payload.username
      || !payload.fullName || !payload.email) throw Error('Invalid parameters');

    const hashPassword = (password) => hashSync(password, 8);
    const copyPayload = Object.assign(payload, { password: hashPassword(payload.password) });
    const user = new User(copyPayload);

    return user.save();
  },

  async comparePassword(user) {
    // eslint-disable-next-line no-underscore-dangle
    const findUser = await User.findOne({ _id: user._id });

    if (!compareSync(user.password, findUser.password)) throw Error('Login failed');
    else return { data: { message: 'exit' } };
  },

  getUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Invalid id');

    return User
      .findOne({ _id: id })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
  },

  getUserByUsername(usname) {
    const username = usname.toString().trim();

    return User
      .findOne({ username })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
  },

  getUsersByUsername(usname) {
    const username = usname.toString().trim();

    return User
      .find({ username: new RegExp(username, 'i') })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } });
  },

  async addFollower(payload) {
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
  },

  async deleteFollower(payload) {
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
  },

  setSecure(_id, secure) {
    return User.findOneAndUpdate({ _id }, { $push: { secure } });
  },

  async signin(payload) {
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
  },

  async logout(payload) {
    const { userId } = payload.logout;

    await User.findOneAndUpdate({ _id: userId }, {
      $pull: { secure: [] },
    });

    return 'success';
  },
};

export default methods;
