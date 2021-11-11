/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import queryResolvers from './resolvers';
import db from './resolvers/Database';

export default new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Query: {
      ...queryResolvers,
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
  },
});
