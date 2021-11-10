/* eslint-disable no-underscore-dangle */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Tweet, User } from '../../src/api';
import { create, connect, closeDatabase } from '../db-handler';

describe('Tweet api', () => {
  let mongod;
  let userCreated;
  let userCreatedB;
  let tweetCreated;
  let answerId;
  let tweetsByUserA = 0;

  beforeAll(async () => {
    mongod = await create();
    await connect(mongod);
  });

  afterAll(async () => {
    await closeDatabase(mongod);
  });

  it('saveTweet() => it should return tweet generated', async () => {
    const mockUser = {
      username: 'test',
      fullName: 'test',
      email: 'test@test.com',
      password: 'p4ssw0rd',
    };
    const mockTweet = { description: 'Hola mundo. #helloworld' };

    userCreated = await User.saveUser(mockUser);
    tweetCreated = await Tweet.saveTweet({ ...mockTweet, user: userCreated._id });
    tweetsByUserA += 1;

    expect(tweetCreated).toBeTruthy();
    expect(tweetCreated.user).toEqual(userCreated._id);
    expect(tweetCreated.description).toEqual(mockTweet.description);
  });

  it('getById() --> it should return tweet created before', async () => {
    const tweet = await Tweet.getById(tweetCreated._id);

    expect(tweet).toBeTruthy();
    expect(tweet._id).toEqual(tweetCreated._id);
    expect(tweet.description).toEqual(tweetCreated.description);
    expect(tweet.user._id).toEqual(userCreated._id);
  });

  it('getByHashtag() --> it should return tweet created before', async () => {
    const hashtags = ['#helloworld'];

    const tweet = await Tweet.getByHashtags('#helloworld');

    expect(tweet).toBeTruthy();
    expect(tweet.length).toBe(1);
    expect(tweet[0]._id).toEqual(tweetCreated._id);
    expect(JSON.stringify(tweet[0].hashtags)).toEqual(JSON.stringify(hashtags));
  });

  it('getByHashtag() --> it should return tweet passing hashtag as parameter without #', async () => {
    const tweet = await Tweet.getByHashtags('helloworld');

    expect(tweet).toBeTruthy();
    expect(tweet.length).toBe(1);
    expect(tweet[0]._id).toEqual(tweetCreated._id);
  });

  it('getByUser() --> it should return 3 tweets by username', async () => {
    const userId = userCreated._id;
    await Tweet.saveTweet({ user: userId, description: '2' });
    await Tweet.saveTweet({ user: userId, description: '3' });

    const tweets = await Tweet.getByUser(userId);
    tweetsByUserA += 2;

    expect(tweets).toBeTruthy();
    expect(tweets.length).toBe(3);
    expect(tweets[1].description).toEqual('2');
    expect(tweets[0].description).toEqual('3');
  });

  it('updateTweet() --> it should update tweet created before', async () => {
    const { _id } = tweetCreated;
    const description = '#holamundo --> #tweetcreated.';

    await Tweet.updateTweet({ id: _id, description });
    const tweet = await Tweet.getById(_id);

    expect(tweet).toBeTruthy();
    expect(tweet.description).toEqual(description);
  });

  it('addAnswer() --> it should add answer to tweet before created', async () => {
    const tweetId = tweetCreated._id;
    const userId = userCreated._id;
    const description = 'Hey. How\'s it going on';

    await Tweet.addAnswer({ tweetId, userId, description });
    const tweet = await Tweet.getById(tweetId);
    answerId = tweet.answers[0]._id;

    expect(tweet.answers).toBeTruthy();
    expect(tweet.answers.length).toBe(1);
    expect(tweet.answers[0].user._id).toEqual(userId);
    expect(tweet.answers[0].description).toEqual(description);
  });

  it('updateAnswer() --> it should update answer before created', async () => {
    const tweetId = tweetCreated._id;
    const description = 'Foo Bar Buzz';

    await Tweet.updateAnswer({ tweetId, answerId, description });
    const tweet = await Tweet.getById(tweetId);

    expect(tweet).toBeTruthy();
    expect(tweet.answers[0].description).toEqual(description);
  });

  it('deleteAnswer() --> it should delete answer added before', async () => {
    const tweetId = tweetCreated._id;

    await Tweet.deleteAnswer({ tweetId, answerId });
    const tweet = await Tweet.getById(tweetId);

    expect(tweet).toBeTruthy();
    expect(tweet.answers.length).toBe(0);
  });

  it('favorite() --> should add favorite to tweet', async () => {
    const mockUser = {
      username: 'foo_bar',
      email: 'foo@foo.foo',
      password: 'p4assw0rd',
      fullName: 'foo bar',
    };
    const tweetId = tweetCreated._id;

    userCreatedB = await User.saveUser(mockUser);
    await Tweet.favorite({ tweetId, fav: true, userId: userCreatedB._id });
    const tweet = await Tweet.getById(tweetId);

    expect(tweet.favs).toBeTruthy();
    expect(tweet.favs.length).toBe(1);
    expect(tweet.favs[0]._id).toEqual(userCreatedB._id);
  });

  it('favorite() --> should add favorite to tweet', async () => {
    const userId = userCreatedB._id;
    const tweetId = tweetCreated._id;

    await Tweet.favorite({ tweetId, fav: false, userId });
    const tweet = await Tweet.getById(tweetId);

    expect(tweet.favs.length).toBe(0);
  });

  it('deleteTweet() --> it should delete tweet created before', async () => {
    const tweetId = tweetCreated._id;

    await Tweet.deleteTweet(tweetId);
    const tweet = await Tweet.getById(tweetId);
    tweetsByUserA -= 1;

    expect(tweet).toBeFalsy();
  });

  it('tweetByFollowingUsers() --> it should return tweets of users that you are following', async () => {
    const filterById = (tweet, userId) => tweet.filter(
      (tw) => JSON.stringify(tw.user._id) === JSON.stringify(userId),
    );

    const userAId = userCreated._id;
    const userBId = userCreatedB._id;
    const mockUser = {
      username: 'useruser',
      fullName: 'user',
      email: 'user@user.user',
      password: 'PaSsWoRd',
    };
    const mockTweets = [
      { description: 'Hola mundo. #helloworld', user: userAId },
      { description: 'Hello world. #holamundo', user: userAId },
      { description: 'Tweet example. i dont know', user: userBId },
      { description: 'Tweet example. i dont know 2', user: userBId },
      { description: 'Tweet example. i dont know 3', user: userBId },
      { description: 'Tweet example. i dont know 4' },
    ];

    const userCreatedC = await User.saveUser(mockUser);
    const userCId = userCreatedC._id;

    mockTweets[mockTweets.length - 1] = {
      ...mockTweets[mockTweets.length - 1],
      user: userCId,
    };

    await User.addFollower({ userFromId: userCId, userToId: userAId });
    await User.addFollower({ userFromId: userCId, userToId: userBId });
    await Promise.all(mockTweets.map((tweet) => Tweet.saveTweet(tweet)));
    const tweets = await Tweet.tweetByFollowingUsers({ id: userCId });

    expect(tweets).toBeTruthy();
    expect(tweets.length).toBe((mockTweets.length - 1) + tweetsByUserA);
    expect(filterById(tweets, userAId).length).toEqual(tweetsByUserA + 2);
    expect(filterById(tweets, userBId).length).toEqual(3);
    expect(filterById(tweets, userCId).length).toEqual(0);
  });
});
