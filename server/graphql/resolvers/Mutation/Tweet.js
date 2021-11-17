/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import db from '../../../Database/Database';

const Mutations = {
  addTweet: async (_, { description }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const newTweet = await db.Tweet.saveTweet({ description, user: userToken });

      return newTweet;
    } catch (error) {
      return null;
    }
  },

  editTweet: async (_, { tweet: { _id, description } }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const findTweet = await db.Tweet.getById(db.Utils.stringToObjectId(_id));
      if (userToken !== db.Utils.objectIdToString(findTweet.user._id)) throw Error(0);

      const updateTweet = await db.Tweet.updateTweet({ id: _id, description });

      return updateTweet;
    } catch (error) {
      return null;
    }
  },

  deleteTweet: async (_, { id }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const findTweet = await db.Tweet.getById(db.Utils.stringToObjectId(id));
      if (userToken !== db.Utils.objectIdToString(findTweet.user._id)) throw Error(0);

      const deleteTweet = await db.Tweet.deleteTweet(db.Utils.stringToObjectId(id));

      return !!deleteTweet;
    } catch (error) {
      return false;
    }
  },

  favTweet: async (_, { fav: { id, favorite } }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const favoriteTweet = await db.Tweet.favorite({
        tweetId: db.Utils.stringToObjectId(id),
        fav: favorite,
        userId: db.Utils.stringToObjectId(userToken),
      });

      return !!favoriteTweet;
    } catch (error) {
      return false;
    }
  },

  addAnswer: async (_, { answer: { tweetId, description } }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const answer = await db.Tweet.addAnswer({ tweetId, userId: userToken, description });

      return answer;
    } catch (error) {
      return null;
    }
  },

  deleteAnswer: async (_, { answer: { tweetId, answerId } }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const findTweet = await db.Tweet.getById(db.Utils.stringToObjectId(tweetId));
      const findAnswer = findTweet.answers.filter((answer) => db.Utils.objectIdToString(answer._id) === answerId);
      if (findAnswer.length !== 1 || db.Utils.objectIdToString((findAnswer[0].user._id) !== userToken)) throw Error(0);

      await db.Tweet.deleteAnswer({ tweetId, answerId });

      return true;
    } catch (error) {
      return false;
    }
  },

  updateAnswer: async (_, { answer: { tweetId, answerId, description } }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const findTweet = await db.Tweet.getById(db.Utils.stringToObjectId(tweetId));
      const findAnswer = findTweet.answers.filter((answer) => db.Utils.objectIdToString(answer._id) === answerId);
      if (findAnswer.length !== 1 || db.Utils.objectIdToString((findAnswer[0].user._id) !== userToken)) throw Error(0);

      const answerUpdated = await db.Tweet.updateAnswer({ tweetId, answerId, description });

      return !!answerUpdated;
    } catch (error) {
      return null;
    }
  },
};

export default Mutations;
