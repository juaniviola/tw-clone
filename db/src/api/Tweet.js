import mongoose from 'mongoose';
import { Tweet, User } from '../models';
import utils from '../utils';

const saveTweet = async (payload) => {
  const { user, description } = payload;

  if (!user || !description) throw Error('Invalid parameters');
  if (!mongoose.Types.ObjectId.isValid(user)) throw Error('Invalid user id');

  if (description.length > 280) throw Error('Maximum of characters exceeded');
  const hashtags = utils.getHashtag(description);
  const mentions = utils.getMentions(description);

  const tweet = new Tweet({
    user,
    description,
    createdAt: new Date(),
    hashtags: hashtags || [],
    mentions: mentions || [],
  });

  await tweet.save();

  return Tweet
    // eslint-disable-next-line no-underscore-dangle
    .findOne({ _id: tweet._id })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } });
};

const tweetsByUser = async (username) => {
  if (!username || typeof username !== 'string') throw Error('Invalid user id');

  const id = await User.findOne({ username });

  return Tweet
    .find({ user: id })
    .sort({ createdAt: -1 })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const tweetById = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return { error: { message: 'Invalid id' } };

  return Tweet
    .findOne({ _id: id })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const tweetsByHashtag = (hashtag) => {
  const hashtagLower = hashtag.toLowerCase();

  return Tweet
    .find({ hashtags: hashtagLower })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const favTweet = async (payload) => {
  const {
    tweetId,
    fav,
    userId,
  } = payload.fav;

  if (!tweetId || !userId
    || fav === null || fav === undefined) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(userId)
    || !mongoose.Types.ObjectId.isValid(tweetId)) throw Error('Invalid id');

  if (fav) {
    await Tweet.findOneAndUpdate({ _id: tweetId }, {
      $push: { favs: userId },
    }, { multi: true });
  } else {
    await Tweet.findOneAndUpdate({ _id: tweetId }, {
      $pull: { favs: userId },
    }, { multi: true });
  }

  return Tweet
    .findOne({ _id: tweetId })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const updateTweet = async (payload) => {
  const {
    _id,
    description,
    userId,
  } = payload.tw;

  if (!_id || !description || !userId) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(userId)
    || !mongoose.Types.ObjectId.isValid(_id)) throw Error('Invalid id');

  const tw = await Tweet.findOne({ _id });
  if (!tw) return { error: { message: 'Tweet not found' } };
  if (!tw.user
    || tw.user.toString().trim() !== userId.toString().trim()) throw Error('Unhauthorized');

  const hashtags = utils.getHashtag(description);
  const mentions = utils.getMentions(description);

  await Tweet.findOneAndUpdate({ _id }, {
    description,
    mentions,
    hashtags,
  });

  return Tweet
    .findOne({ _id })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const deleteTweet = async (payload) => {
  const { tweetId, userId } = payload.tw;
  if (!tweetId || !userId) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(tweetId)
    || !mongoose.Types.ObjectId.isValid(userId)) throw Error('Invalid id');

  const tw = await Tweet.findOne({ _id: tweetId });
  if (!tw.user
    || (tw.user.toString().trim() !== userId.toString().trim())) throw Error('Unhauthorized');

  return Tweet.findOneAndRemove({ _id: tweetId });
};

const addAnswer = async (payload) => {
  const {
    tweetId,
    userId,
    description,
  } = payload.answer;
  if (!tweetId || !userId || !description) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(tweetId)
    || !mongoose.Types.ObjectId.isValid(userId)) throw Error('Invalid id');

  await Tweet.findOneAndUpdate({ _id: tweetId }, {
    $push: {
      answers: {
        user: userId,
        description,
        createdAt: new Date(),
      },
    },
  });

  return Tweet
    .findOne({ _id: tweetId })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const deleteAnswer = async (payload) => {
  const {
    tweetId,
    answerId,
    userId,
  } = payload.answer;
  if (!tweetId || !answerId || !userId) throw Error('Invalid parameters');

  if (!mongoose.Types.ObjectId.isValid(tweetId)
    || !mongoose.Types.ObjectId.isValid(userId)
    || !mongoose.Types.ObjectId.isValid(answerId)) throw Error('Invalid id');

  const tw = await Tweet
    .findOne({ _id: tweetId })
    .select({ answers: { $elemMatch: { _id: answerId } } });

  if ((tw.answers.length === 0) || !tw) throw Error('Answer not found');
  if (!tw.answers[0].user
    || (tw.answers[0].user.toString().trim() !== userId.toString().trim())) throw Error('Unhauthorized');

  await Tweet.findOneAndUpdate({ _id: tweetId }, {
    $pull: {
      answers: {
        _id: answerId,
      },
    },
  });

  return Tweet
    .findOne({ _id: tweetId })
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

const tweetByFollowingUsers = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw Error('Invalid id');

  const findUser = await User.findOne({ _id: userId });
  if (!findUser) throw Error('User not found');

  return Tweet
    .find({ $or: [{ user: { $in: findUser.following } }, { user: userId }] })
    .sort({ createdAt: -1 })
    .limit(30)
    .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
    .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
};

export {
  saveTweet,
  tweetsByUser,
  tweetById,
  tweetsByHashtag,
  favTweet,
  updateTweet,
  deleteTweet,
  addAnswer,
  deleteAnswer,
  tweetByFollowingUsers,
};
