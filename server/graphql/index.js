import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
};

export default new ApolloServer({
  typeDefs: schema,
  resolvers,
});
