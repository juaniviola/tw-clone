import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';

function create() {
  return MongoMemoryServer.create();
}

async function connect(mongod) {
  const uri = mongod.getUri();
  const mongooseOptions = {
    useNewUrlParser: true,
  };

  return mongoose.connect(uri, mongooseOptions);
}

async function closeDatabase(mongod) {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

export {
  create,
  connect,
  closeDatabase,
};
