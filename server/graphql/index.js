import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import context from './context';

export default new ApolloServer({
  typeDefs: schema,
  resolvers,
  context,
});
