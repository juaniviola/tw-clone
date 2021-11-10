import mongoose from 'mongoose';
import { Tweet, User } from '../models';
import utils from '../utils';

const saveTweet = async (payload) => {
  const { user, description } = payload;

  if (!user || !description) throw Error('Invalid parameters');
  if (!mongoose.Types.ObjectId.isValid(user)) throw Error('Invalid user id');

  const tweet = new Tweet({
    user,
    description,
    createdAt: new Date(),
    hashtags: utils.getHashtag(description) || [],
    mentions: utils.getMentions(description) || [],
  });

  return tweet.save();
};

const getById = async (id) => Tweet
  .findOne({ _id: id })
  .sort({ createdAt: -1 })
  .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
  .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
  .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });

const getByHashtags = (hashtag) => {
  const htx = hashtag[0] === '#' ? hashtag : '#'.concat(hashtag);

  return Tweet
    .find({ hashtags: htx.toLowerCase() })
    .sort({ createdAt: -1 })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const getByUser = (id) => Tweet
  .find({ user: id })
  .sort({ createdAt: -1 })
  .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
  .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
  .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });

const favorite = async ({ tweetId, fav, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tweetId)) throw Error('Invalid id');

  const isFav = fav ? { $push: { favs: userId } } : { $pull: { favs: userId } };

  return Tweet.findOneAndUpdate({ _id: tweetId }, isFav, { multi: true });
};

const updateTweet = async ({ id, description }) => {
  if (!description) throw Error('Invalid parameters');
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Invalid id');

  return Tweet.findOneAndUpdate({ _id: id }, {
    description,
    mentions: utils.getHashtag(description),
    hashtags: utils.getMentions(description),
  });
};

const deleteTweet = async (id) => Tweet.findOneAndRemove({ _id: id });

const addAnswer = async ({ tweetId, userId, description }) => {
  if (!description) throw Error('Invalid parameters');
  if (!mongoose.Types.ObjectId.isValid(tweetId) || !mongoose.Types.ObjectId.isValid(userId)) throw Error('Invalid id');

  return Tweet.findOneAndUpdate({ _id: tweetId }, {
    $push: {
      answers: {
        user: userId,
        description,
        createdAt: new Date(),
      },
    },
  });
};

const deleteAnswer = async ({ tweetId, answerId }) => {
  if (!mongoose.Types.ObjectId.isValid(tweetId)
    || !mongoose.Types.ObjectId.isValid(answerId)) throw Error('Invalid ids');

  return Tweet.findOneAndUpdate({ _id: tweetId }, {
    $pull: {
      answers: {
        _id: answerId,
      },
    },
  });
};

const updateAnswer = async ({ tweetId, answerId, description }) => {
  if (!mongoose.Types.ObjectId.isValid(tweetId)
    || !mongoose.Types.ObjectId.isValid(answerId)) throw Error('Invalid ids');

  return Tweet.findOneAndUpdate({ 'answers._id': answerId }, { $set: { 'answers.$.description': description } });
};

const tweetByFollowingUsers = async ({ id = null, offset = 0, limit = 30 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Invalid id');

  const user = await User.findOne({ _id: id });
  if (!user) throw Error('User not found');

  return Tweet
    .find({ user: { $in: user.following } })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

export {
  saveTweet,
  getById,
  getByHashtags,
  getByUser,
  favorite,
  updateTweet,
  deleteTweet,
  addAnswer,
  deleteAnswer,
  updateAnswer,
  tweetByFollowingUsers,
};
