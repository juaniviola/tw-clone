import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { create, connect, closeDatabase } from '../db-handler';
import User from '../../src/models/User';

describe('User database model', () => {
  let mongod;

  beforeAll(async () => {
    mongod = await create();
    await connect(mongod);
  });

  afterAll(async () => {
    await closeDatabase(mongod);
  });

  it('it should return error with empty user', async () => {
    const noUser = new User({});
    let err = null;

    try {
      await noUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('it should return error with invalid email', async () => {
    const mockUser = new User({
      id: '123',
      username: 'foobar',
      password: 'foobarbuzz',
      fullName: 'foo bar',
      email: 'foobar-email.com',
    });
    let err = null;

    try {
      await mockUser.save();
    } catch (error) {
      err = error;
    }

    expect(err.errors.email).toBeTruthy();
  });

  it('it should return error with password length less than 8', async () => {
    const mockUser = new User({
      id: '1234',
      username: 'foobarr',
      password: 'foobar',
      fullName: 'foo bar',
      email: 'foobar@email.com',
    });
    let err = null;

    try {
      await mockUser.save();
    } catch (error) {
      err = error;
    }

    expect(err.errors.password).toBeTruthy();
  });

  it('it should not return error with valid user', async () => {
    const userMock = new User({
      id: '123456',
      username: 'foobarfoo',
      password: 'foobarbuzz',
      fullName: 'foo bar',
      email: 'foobarbuzz@email.com',
    });
    let err = null;

    try {
      await userMock.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeFalsy();
  });
});
