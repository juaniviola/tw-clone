/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import db from '../Database';
import { wrapAsync, verifyToken } from '../modules';
import config from '../../../config';

const { SECRET_TOKEN } = config;

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
    const query = await wrapAsync(
      db.Tweet.getByUser,
      wrapAsync(db.Utils.stringToObjectId, id),
    );
    return query;
  },
  tweetsByFollowingUsers: async (_, { token }) => {
    try {
      const decodeToken = await verifyToken(token, SECRET_TOKEN);
      const { iss } = decodeToken;

      const tweets = await db.Tweet.tweetByFollowingUsers({ id: iss });
      return tweets;
    } catch (error) {
      return null;
    }
  },
};

export default Querys;
