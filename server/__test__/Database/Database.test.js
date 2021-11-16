/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import database from '../../Database/Database';
import connectDb from '../db_handler';

describe('test connection to database', () => {
  beforeAll(async () => {
    const mongod = await connectDb();
    await database.connect(mongod.getUri());
  });

  it('methods', () => {
    expect(database.uri).toBeTruthy();
    expect(database.Tweet).toBeTruthy();
    expect(database.User).toBeTruthy();
    expect(database.Utils).toBeTruthy();
  });

  it('get', async () => {
    const users = await database.User.getUsersByUsername('test');

    expect(users).toBeTruthy();
    expect(Array.isArray(users)).toBeTruthy();
  });
});
