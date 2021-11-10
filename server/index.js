/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-console */
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import server from './graphql';
import database from './graphql/resolvers/Database';

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error(err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(err.message);
  process.exit(1);
});

async function runServer() {
  const isEnvDev = process.env.ENV === 'dev';
  const app = express();
  app.use(helmet());
  app.use(cors());

  const memoryDb = isEnvDev ? Promise.resolve(MongoMemoryServer.create()) : null;
  const uri = isEnvDev ? (await memoryDb).getUri() : process.env.URL_DB;

  await database.connect(uri);

  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  const httpServer = http.createServer(app);
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

runServer().catch((err) => console.error(err));
