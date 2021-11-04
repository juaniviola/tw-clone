/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { User } from '../../src/api';
import { create, connect, closeDatabase } from '../db-handler';

describe('Test User Api', () => {
  let mongod;
  let userCreated;
  let userCreated2;

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
    userCreated2 = newUser;

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

  it('getByUsername() --> it should return user with valid username', async () => {
    const getUser = await User.getByUsername(userCreated.username);

    expect(getUser).toBeTruthy();
    expect(getUser.id).toEqual(userCreated.id);
  });

  it('getUsersByUsername() --> it should return users list', async () => {
    const getUser = await User.getUsersByUsername('test');

    expect(getUser).toBeTruthy();
    expect(getUser.length).toEqual(2);
  });

  it('addFollower() --> mockuser2 should have 1 follower', async () => {
    const update = await User.addFollower({ userFromId: userCreated._id, userToId: userCreated2._id });
    const getUser = await User.getById(userCreated.id);
    const getUser2 = await User.getById(userCreated2.id);

    expect(update).toBeTruthy();
    expect(getUser).toBeTruthy();
    expect(getUser2).toBeTruthy();
    expect(getUser.following.length).toEqual(1);
    expect(getUser2.followers.length).toEqual(1);
    expect(getUser.following[0]).toEqual(userCreated2._id);
    expect(getUser2.followers[0]).toEqual(userCreated._id);
  });

  it('getFollowers() --> it should return followers of mockuser2 and following of mockuser', async () => {
    const user2 = await User.getFollowers(userCreated2._id);
    const user = await User.getFollowers(userCreated._id);

    expect(user2.followers).toBeTruthy();
    expect(user.following).toBeTruthy();
    expect(user2.followers.length).toBe(1);
    expect(user.following.length).toBe(1);
    expect(user2.followers[0].username).toEqual(userCreated.username);
    expect(user.following[0].username).toEqual(userCreated2.username);
  });

  it('deleteFollower() --> mockuser2 shouldnt have followers', async () => {
    await User.deleteFollower({ userFromId: userCreated._id, userToId: userCreated2._id });
    const getUser = await User.getById(userCreated.id);
    const getUser2 = await User.getById(userCreated2.id);

    expect(getUser).toBeTruthy();
    expect(getUser2).toBeTruthy();
    expect(getUser.following.length).toEqual(0);
    expect(getUser2.followers.length).toEqual(0);
  });
});
