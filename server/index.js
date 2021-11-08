/* eslint-disable no-console */
import express from 'express';
import graphQl from 'apollo-server-express';
import cors from 'cors';
import helmet from 'helmet';
import schema from './schema';

const PORT = process.env.PORT || 5000;
const app = express();
const { graphqlExpress, graphiqlExpress } = graphQl;

app.use(cors());
app.use(helmet());
app.use('/graphql', express.json(), graphqlExpress({ schema }));

if (process.env.NODE_ENV === 'development') {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

process.on('uncaughtException', (err) => {
  console.error(err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(err.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log('[Server] Listening on port ', PORT);
});
