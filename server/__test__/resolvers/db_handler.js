// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';

function create() {
  return MongoMemoryServer.create();
}

export default create;
