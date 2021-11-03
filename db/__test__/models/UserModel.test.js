import 'core-js/stable';
import 'regenerator-runtime/runtime';
import User from '../../src/models/User';
import { create, connect, closeDatabase } from '../db-handler';

describe('User database model', () => {
  let mongod;

  const mockUser = new User({
    id: '123',
    username: 'foobar',
    password: 'foobar',
    fullName: 'foo bar',
    email: 'foobar-email.com',
  });

  beforeAll(async () => {
    mongod = await create();
    await connect(mongod);
  });

  afterAll(async () => {
    await closeDatabase(mongod);
  });

  it('it should return error with empty user', async () => {
    const newUser = new User();
    let err = null;

    try {
      await newUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('it should return error with invalid email', async () => {
    let err = null;

    try {
      await mockUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('it should return error with password length less than 8', async () => {
    let err = null;

    try {
      await mockUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('it should not return error with valid user', async () => {
    const userMock = new User({
      id: '123',
      username: 'foobar',
      password: 'foobarbuzz',
      fullName: 'foo bar',
      email: 'foobar@email.com',
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
