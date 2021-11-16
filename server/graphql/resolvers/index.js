/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import userQuery from './Query/User';
import userMutation from './Mutation/User';
import tweetQuery from './Query/Tweet';
import tweetMutation from './Mutation/Tweet';
import db from '../../Database/Database';

export default {
  Query: {
    ...userQuery,
    ...tweetQuery,
  },
  Mutation: {
    ...userMutation,
    ...tweetMutation,
  },
  User: {
    _id: ({ _id }) => db.Utils.objectIdToString(_id),
  },
  Tweet: {
    _id: ({ _id }) => db.Utils.objectIdToString(_id),
  },
  Answer: {
    _id: ({ _id }) => db.Utils.objectIdToString(_id),
  },
  TweetCreated: {
    _id: ({ _id }) => db.Utils.objectIdToString(_id),
    user: ({ user }) => db.Utils.objectIdToString(user),
  },
  UserFollower: {
    _id: ({ _id }) => db.Utils.objectIdToString(_id),
  },
};
