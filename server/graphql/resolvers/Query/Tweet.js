/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import db from '../../../Database/Database';
import wrapAsync from '../modules';

const Querys = {
  tweetById: async (_, { id }) => {
    const query = await wrapAsync(db.Tweet.getById, id);
    return query;
  },

  tweetsByHashtag: async (_, { hashtag }) => {
    const query = await wrapAsync(db.Tweet.getByHashtags, hashtag);
    return query;
  },

  tweetsByUser: async (_, { id }) => {
    const query = await wrapAsync(db.Tweet.getByUser, id);

    return query;
  },

  tweetsByUsername: async (_, { username }) => {
    const query = await wrapAsync(db.Tweet.getByUsername, username);

    return query;
  },

  tweetsByFollowingUsers: async (_, __, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const tweets = await db.Tweet.tweetByFollowingUsers({ id: userToken });

      return tweets;
    } catch (error) {
      return null;
    }
  },

  tweetFavorites: async (_, { id }) => {
    try {
      const query = await db.Tweet.getByIdPopulated(id);

      return query.favs ? query.favs : null;
    } catch (error) {
      return null;
    }
  },

  tweetAnswers: async (_, { id }) => {
    try {
      const query = await db.Tweet.getByIdPopulated(id);

      return query.answers ? query.answers : null;
    } catch (error) {
      return null;
    }
  },

  tweetsLikedByUser: async (_, { id }) => {
    try {
      const query = await db.Tweet.getLikesByUser(id);

      return query || null;
    } catch (error) {
      return null;
    }
  },
};

export default Querys;
