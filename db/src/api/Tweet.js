import { Tweet, User } from '../models';
import utils from '../utils';

const { getHashtag, getMentions } = utils;

const saveTweet = async ({ user = null, description = null } = {}) => {
  const tweet = new Tweet({
    user,
    description,
    createdAt: new Date(),
    hashtags: getHashtag(description),
    mentions: getMentions(description),
  });

  return tweet.save();
};

const getById = async (id) => Tweet
  .findOne({ _id: id })
  .sort({ createdAt: -1 })
  .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } });

const getByIdPopulated = async (id) => Tweet
  .findOne({ _id: id })
  .sort({ createdAt: -1 })
  .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } })
  .populate({ path: 'favs', options: { select: { _id: 1, username: 1, fullName: 1 } } })
  .populate({ path: 'answers.user', options: { select: { _id: 1, username: 1, fullName: 1 } } });

const getByHashtags = (hashtag) => {
  const htx = (hashtag[0] === '#' ? hashtag : '#'.concat(hashtag)).toLowerCase();

  return Tweet
    .find({ hashtags: htx })
    .sort({ createdAt: -1 })
    .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { _id: 1, username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { _id: 1, username: 1, fullName: 1 } } });
};

const getByUser = (id) => Tweet
  .find({ user: id })
  .sort({ createdAt: -1 })
  .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } });

const getByUsername = (username) => Tweet
  .find({ username: username.toString().trim() })
  .sort({ createdAt: -1 })
  .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } });

const getLikesByUser = (_id) => Tweet
  .find({ favs: _id })
  .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } })
  .populate({ path: 'favs', options: { select: { _id: 1, username: 1, fullName: 1 } } })
  .populate({ path: 'answers.user', options: { select: { _id: 1, username: 1, fullName: 1 } } });

const favorite = async ({ tweetId = null, fav = false, userId = null } = {}) => {
  const isFav = fav ? { $push: { favs: userId } } : { $pull: { favs: userId } };

  return Tweet.findOneAndUpdate(
    { _id: tweetId },
    isFav,
    { new: true },
  );
};

const updateTweet = async ({ id = null, description = null } = {}) => Tweet
  .findOneAndUpdate({ _id: id }, {
    description,
    mentions: getMentions(description),
    hashtags: getHashtag(description),
  }, { new: true });

const deleteTweet = async (id) => Tweet.findOneAndRemove({ _id: id });

const addAnswer = async ({ tweetId = null, userId = null, description = null } = {}) => Tweet
  .findOneAndUpdate({ _id: tweetId }, {
    $push: {
      answers: {
        user: userId,
        description,
        createdAt: new Date(),
      },
    },
  }, { new: true });

const deleteAnswer = async ({ tweetId = null, answerId = null } = {}) => Tweet
  .findOneAndUpdate({ _id: tweetId }, {
    $pull: {
      answers: {
        _id: answerId,
      },
    },
  });

const updateAnswer = async ({ answerId = null, description = null } = {}) => Tweet
  .findOneAndUpdate(
    { 'answers._id': answerId },
    { $set: { 'answers.$.description': description } },
    { new: true },
  );

const tweetByFollowingUsers = async ({ id = null, offset = 0, limit = 30 } = {}) => {
  const user = await User.findOne({ _id: id });
  if (!user) throw Error('User not found');

  return Tweet
    .find({ user: { $in: user.following } })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({ path: 'user', options: { select: { _id: 1, username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { _id: 1, username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { _id: 1, username: 1, fullName: 1 } } });
};

export {
  saveTweet,
  getById,
  getByIdPopulated,
  getByHashtags,
  getByUser,
  getByUsername,
  favorite,
  updateTweet,
  deleteTweet,
  addAnswer,
  deleteAnswer,
  updateAnswer,
  tweetByFollowingUsers,
  getLikesByUser,
};
