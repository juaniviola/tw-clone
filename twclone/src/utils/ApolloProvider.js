import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { createApolloProvider } from '@vue/apollo-option';
import config from '@/config';

const httpLink = new HttpLink({
  uri: config.server,
  credentials: 'include',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // cache disabled, just for practicity
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

export default apolloProvider;
