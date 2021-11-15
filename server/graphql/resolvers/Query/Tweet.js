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

  tweetsByFollowingUsers: async (_, __, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const tweets = await db.Tweet.tweetByFollowingUsers({ id: userToken });

      return tweets;
    } catch (error) {
      return null;
    }
  },
};

export default Querys;
