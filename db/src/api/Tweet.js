import mongoose from 'mongoose';
import { Tweet, User } from '../models';
import utils from '../utils';

async function checkSecure(id, secure) {
  const user = await User.findOne({ _id: id });
  if (!user || !user.secure || user.secure.length === 0) return false;

  const conf = user.secure.find((sec) => sec === secure);
  return !!conf;
}

const methods = {
  async saveTweet(payload) {
    const { user, secure, description } = payload;

    if (!user || !secure || !description) throw Error('Invalid parameters');
    if (!mongoose.Types.ObjectId.isValid(user)) throw Error('Invalid user id');

    const isSecure = await checkSecure(user, secure);
    if (!isSecure) throw Error('Unhauthorized');

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
  },

  async tweetsByUser(username) {
    if (!username || typeof username !== 'string') throw Error('Invalid user id');

    const id = await User.findOne({ username });

    return Tweet
      .find({ user: id })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
  },

  tweetById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return { error: { message: 'Invalid id' } };

    return Tweet
      .findOne({ _id: id })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
  },

  tweetsByHashtag(hashtag) {
    const hashtagLower = hashtag.toLowerCase();

    return Tweet
      .find({ hashtags: hashtagLower })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } });
  },

  async favTweet(payload) {
    const {
      tweetId,
      fav,
      userId,
      userSecure,
    } = payload.fav;

    if (!tweetId || !userId || !userSecure
      || fav === null || fav === undefined) throw Error('Invalid parameters');

    if (!mongoose.Types.ObjectId.isValid(userId)
      || !mongoose.Types.ObjectId.isValid(tweetId)) throw Error('Invalid id');

    const isSecure = await checkSecure(userId, userSecure);
    if (!isSecure) throw Error('Unhauthorized');

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
  },

  async updateTweet(payload) {
    const {
      _id,
      description,
      secure,
      userId,
    } = payload.tw;

    if (!_id || !description || !secure || !userId) throw Error('Invalid parameters');

    if (!mongoose.Types.ObjectId.isValid(userId)
      || !mongoose.Types.ObjectId.isValid(_id)) throw Error('Invalid id');

    const isSecure = await checkSecure(userId, secure);
    if (!isSecure) throw Error('Unhauthorized');

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
  },

  async deleteTweet(payload) {
    const { tweetId, userId, userSecure } = payload.tw;
    if (!tweetId || !userId || !userSecure) throw Error('Invalid parameters');

    if (!mongoose.Types.ObjectId.isValid(tweetId)
      || !mongoose.Types.ObjectId.isValid(userId)) throw Error('Invalid id');

    const isSecure = await checkSecure(userId, userSecure);
    if (!isSecure) throw Error('Unhauthorized');

    const tw = await Tweet.findOne({ _id: tweetId });
    if (!tw.user
      || (tw.user.toString().trim() !== userId.toString().trim())) throw Error('Unhauthorized');

    return Tweet.findOneAndRemove({ _id: tweetId });
  },

  async addAnswer(payload) {
    const {
      tweetId,
      userId,
      userSecure,
      description,
    } = payload.answer;
    if (!tweetId || !userId || !userSecure || !description) throw Error('Invalid parameters');

    if (!mongoose.Types.ObjectId.isValid(tweetId)
      || !mongoose.Types.ObjectId.isValid(userId)) throw Error('Invalid id');

    const isSecure = await checkSecure(userId, userSecure);
    if (!isSecure) throw Error('Unhauthorized');

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
  },

  async deleteAnswer(payload) {
    const {
      tweetId,
      answerId,
      userId,
      userSecure,
    } = payload.answer;
    if (!tweetId || !answerId || !userId || !userSecure) throw Error('Invalid parameters');

    if (!mongoose.Types.ObjectId.isValid(tweetId)
      || !mongoose.Types.ObjectId.isValid(userId)
      || !mongoose.Types.ObjectId.isValid(answerId)) throw Error('Invalid id');

    const isSecure = await checkSecure(userId, userSecure);
    if (!isSecure) throw Error('Unhauthorized');

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
  },

  async tweetByFollowingUsers(userId) {
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
  },
};

export default methods;
