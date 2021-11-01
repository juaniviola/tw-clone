import 'core-js/stable';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import Tweet from '../../src/models/Tweet';

describe('Tweet database model', () => {
  const mockTweet = new Tweet({
    user: '1238723',
    description: 'hola mundo',
  });

  it('should return error with empty tweet', async () => {
    const newTweet = new Tweet();
    let err = null;

    try {
      await newTweet.validate();
    } catch (error) {
      err = error;
    }

    expect(err.errors.user).toBeTruthy();
    expect(err.errors.description).toBeTruthy();
  });

  it('should return error with invalid user id', async () => {
    let err = null;

    try {
      await mockTweet.validate();
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
      await newTweet.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeFalsy();
  });
});
