import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { User } from '../../src/api';
import { create, connect, closeDatabase } from '../db-handler';

describe('Test User Api', () => {
  let mongod;
  let createUser;

  beforeAll(async () => {
    mongod = await create();
    await connect(mongod);
  });

  afterAll(async () => {
    await closeDatabase(mongod);
  });

  it('saveUser() --> should be ok with valid mock user', async () => {
    const user = {
      username: 'user_test',
      password: 'passw0rd',
      email: 'ut@email.com',
      fullName: 'User test',
    };

    const newUser = await User.saveUser(user);

    expect(newUser).toBeTruthy();
    expect(newUser.id).toBeTruthy();
    expect(newUser.password).toBeTruthy();
    expect(newUser.username).toEqual(user.username);
    expect(newUser.fullName).toEqual(user.fullName);
    expect(newUser.email).toEqual(user.email);
  });

  it('saveUser() --> should return error with invalid payload', async () => {
    let err = null;
    const user = {
      username: 'user_test',
      password: 'p4ss',
      fullName: 'User test',
    };

    try {
      await User.saveUser(user);
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('saveUser() --> should return error username duplicated', async () => {
    let err = null;
    const user = {
      username: 'usertest',
      password: 'passw0rd',
      email: 'utt@email.com',
      fullName: 'User test',
    };

    const user2 = {
      username: 'usertest',
      password: 'passw0rd',
      email: 'u_tt@email.com',
      fullName: 'User test',
    };

    try {
      await User.saveUser(user);
      await User.saveUser(user2);
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('getById() --> it should return user with id parameter', async () => {
    const user = {
      username: 'test',
      password: 'passw0rd',
      email: 'test@email.com',
      fullName: 'User test',
    };

    createUser = await User.saveUser(user);
    // eslint-disable-next-line no-underscore-dangle
    const findUser = await User.getById(createUser._id);

    expect(createUser).toBeTruthy();
    expect(findUser).toBeTruthy();
    expect(findUser.username).toBe(user.username);
    // eslint-disable-next-line no-underscore-dangle
    expect(findUser._id).toEqual(createUser._id);
  });

  it('getById() --> it should return error with invalid id', async () => {
    let err = null;

    try {
      await User.getById('1234');
    } catch (error) {
      err = error;
    }
    expect(err).toBeTruthy();
    expect(err.message).toEqual('Invalid id');
  });

  it('comparePassword() --> it should return true with valid user', async () => {
    const comparePass = await User.comparePassword({ id: createUser.id, password: 'passw0rd' });

    expect(comparePass).toBeTruthy();
  });

  it('comparePassword() --> it should return false with invalid password', async () => {
    const comparePass = await User.comparePassword({ id: createUser.id, password: 'password' });

    expect(comparePass).toBeFalsy();
  });
});
