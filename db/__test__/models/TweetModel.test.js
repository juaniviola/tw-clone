import 'core-js/stable';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import Tweet from '../../src/models/Tweet';
import { create, connect, closeDatabase } from '../db-handler';

describe('Tweet database model', () => {
  let mongod;

  const mockTweet = new Tweet({
    user: '1238723',
    description: 'hola mundo',
  });

  beforeAll(async () => {
    mongod = await create();
    await connect(mongod);
  });

  afterAll(async () => {
    await closeDatabase(mongod);
  });

  it('should return error with empty tweet', async () => {
    const newTweet = new Tweet();
    let err = null;

    try {
      await newTweet.save();
    } catch (error) {
      err = error;
    }

    expect(err.errors.user).toBeTruthy();
    expect(err.errors.description).toBeTruthy();
  });

  it('should return error with invalid user id', async () => {
    let err = null;

    try {
      await mockTweet.save();
    } catch (error) {
      err = error;
    }

    expect(err.errors.user).toBeTruthy();
  });

  it('should not return error with valid tweet', async () => {
    const newTweet = new Tweet({
      user: new mongoose.Types.ObjectId(),
      description: 'hola mundo again',
    });
    let err = null;

    try {
      await newTweet.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeFalsy();
  });
});
