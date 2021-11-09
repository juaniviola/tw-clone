import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Database from '../../graphql/resolvers/Database';
import connectDb from './db_handler';

describe('test connection to database', () => {
  let database;

  beforeAll(async () => {
    const mongod = await connectDb();
    database = new Database();
    await database.connect(mongod.getUri());
  });

  it('methods', () => {
    expect(database.uri).toBeTruthy();
    expect(database.Tweet).toBeTruthy();
    expect(database.User).toBeTruthy();
  });

  it('get', async () => {
    const users = await database.User.getUsersByUsername('test');

    expect(users).toBeTruthy();
    expect(Array.isArray(users)).toBeTruthy();
  });
});
