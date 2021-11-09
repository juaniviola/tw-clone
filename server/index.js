/* eslint-disable no-console */
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
import server from './graphql';

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
  const app = express();
  app.use(helmet());
  app.use(cors());

  await server.start();
  server.applyMiddleware({
    app,
    path: '/',
  });

  const httpServer = http.createServer(app);
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}`);
}

runServer();
