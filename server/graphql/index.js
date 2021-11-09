import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import queryResolvers from './resolvers';

export default new ApolloServer({
  typeDefs: schema,
  resolvers: {
    Query: {
      ...queryResolvers,
    },
  },
});
