/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { User } from '../../src/api';
import { create, connect, closeDatabase } from '../db-handler';

describe('Test User Api', () => {
  let mongod;
  let userCreated;
  const mockUser = {
    username: 'user_test',
    password: 'passw0rd',
    email: 'ut@email.com',
    fullName: 'User test',
  };

  const mockUser2 = {
    username: 'test',
    password: 'passw0rd',
    email: 'test@email.com',
    fullName: 'User test',
  };

  beforeAll(async () => {
    mongod = await create();
    await connect(mongod);
  });

  afterAll(async () => {
    await closeDatabase(mongod);
  });

  it('saveUser() --> should be ok with valid mock user', async () => {
    const newUser = await User.saveUser(mockUser);

    expect(newUser).toBeTruthy();
    expect(newUser.id).toBeTruthy();
    expect(newUser.password).toBeTruthy();
    expect(newUser.username).toEqual(mockUser.username);
    expect(newUser.fullName).toEqual(mockUser.fullName);
    expect(newUser.email).toEqual(mockUser.email);
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

    try {
      await User.saveUser(mockUser);
    } catch (error) {
      err = error;
    }

    expect(err).toBeTruthy();
  });

  it('getById() --> it should return user with id parameter', async () => {
    userCreated = await User.saveUser(mockUser2);
    const findUser = await User.getById(userCreated.id);

    expect(userCreated).toBeTruthy();
    expect(findUser).toBeTruthy();
    expect(findUser.username).toBe(mockUser2.username);
    expect(findUser._id).toEqual(userCreated._id);
  });

  it('getById() --> it should return error with invalid id', async () => {
    const getUser = await User.getById('foo');

    expect(getUser).toBeFalsy();
  });

  it('comparePassword() --> it should return true with valid user', async () => {
    const comparePass = await User.comparePassword({ id: userCreated.id, password: 'passw0rd' });

    expect(comparePass).toBeTruthy();
  });

  it('comparePassword() --> it should return false with invalid password', async () => {
    const comparePass = await User.comparePassword({ id: userCreated.id, password: 'password' });

    expect(comparePass).toBeFalsy();
  });

  it('getUserByUsername() --> it should return user with valid username', async () => {
    const getUser = await User.getUserByUsername(userCreated.username);

    expect(getUser).toBeTruthy();
    expect(getUser.id).toEqual(userCreated.id);
  });

  it('getUsersByUsername() --> it should return users list', async () => {
    const getUser = await User.getUsersByUsername('test');

    expect(getUser).toBeTruthy();
    expect(getUser.length).toEqual(2);
  });
});
