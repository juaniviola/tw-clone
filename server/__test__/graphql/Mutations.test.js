/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { ApolloServer } from 'apollo-server';
import database from '../../Database/Database';
import connectDb from '../db_handler';
import schema from '../../graphql/schema';
import resolvers from '../../graphql/resolvers';

describe('Mutations', () => {
  let server;
  let userToken = '';
  let userMock;
  let userMock2;
  let userId;
  let tweetId;
  let answerId;

  beforeAll(async () => {
    // setup db
    const mongod = await connectDb();
    await database.connect(mongod.getUri());

    // setup sv
    server = new ApolloServer({
      typeDefs: schema,
      resolvers,
      context: () => ({ userToken }),
    });
  });

  describe('User Mutations', () => {
    it('addUser() --> it should return user created', async () => {
      const query = 'mutation($user: newUser!) { addUser(user:$user) { _id username } }';
      const mockUser = {
        username: 'test_user',
        password: 'p4ssw0rd',
        email: 'test@test.io',
        fullName: 'test test',
      };

      const resultQuery = await server.executeOperation({
        query,
        variables: { user: mockUser },
      });

      userToken = resultQuery.data.addUser._id;
      userMock = resultQuery.data.addUser;

      expect(resultQuery.data.addUser).toBeTruthy();
      expect(resultQuery.data.addUser.username).toEqual(mockUser.username);
    });

    it('addFollow() --> it should return true', async () => {
      const user = await database.User.saveUser({
        username: 'test',
        password: 'p4ssw0rd',
        email: 'test@me.com',
        fullName: 'test',
      });

      userId = database.Utils.objectIdToString(user._id);
      userMock2 = user;

      const query = 'mutation($userId: String!) { addFollow(userId: $userId) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { userId },
      });

      const userFollowers = await database.User.getFollowers(userId);

      expect(resultQuery.data.addFollow).toBeTruthy();
      expect(userFollowers.followers.length).toBe(1);
      expect(userFollowers.followers[0].username).toEqual('test_user');
    });

    it('deleteFollow() --> it should return true', async () => {
      const query = 'mutation($userId: String!) { deleteFollow(userId: $userId) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { userId },
      });

      const userFollowers = await database.User.getFollowers(userId);

      expect(resultQuery.data.deleteFollow).toBeTruthy();
      expect(userFollowers.followers.length).toBe(0);
    });
  });

  describe('Tweet Mutations', () => {
    it('addTweet() --> should return tweet created by user created before', async () => {
      const query = 'mutation($desc: String!) { addTweet(description: $desc) { _id description user } }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { desc: 'hola mundo. #bye' },
      });

      tweetId = resultQuery.data.addTweet._id;

      expect(resultQuery.data.addTweet).toBeTruthy();
      expect(resultQuery.data.addTweet.description).toEqual('hola mundo. #bye');
      expect(resultQuery.data.addTweet.user).toEqual(userToken);
    });

    it('editTweet() --> should return tweet updated', async () => {
      const query = 'mutation($tw: editTwInput!) { editTweet(tweet: $tw) { description user } }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { tw: { _id: tweetId, description: 'tweet updated' } },
      });

      expect(resultQuery.data.editTweet).toBeTruthy();
      expect(resultQuery.data.editTweet.description).toEqual('tweet updated');
      expect(resultQuery.data.editTweet.user).toEqual(userToken);
    });

    it('favTweet() --> should return true', async () => {
      userToken = userId;
      const query = 'mutation($fav: favInput!) { favTweet(fav: $fav) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { fav: { id: tweetId, favorite: true } },
      });

      const tweet = await database.Tweet.getByIdPopulated(tweetId);

      expect(resultQuery.data.favTweet).toBeTruthy();
      expect(tweet.favs.length).toBe(1);
      expect(tweet.favs[0].username).toEqual(userMock2.username);
    });

    it('favTweet() --> should return true with param false', async () => {
      const query = 'mutation($fav: favInput!) { favTweet(fav: $fav) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { fav: { id: tweetId, favorite: false } },
      });

      const tweet = await database.Tweet.getById(tweetId);

      expect(resultQuery.data.favTweet).toBeTruthy();
      expect(tweet.favs.length).toBe(0);
    });

    it('addAnswer() --> should return anwer', async () => {
      const query = 'mutation($ans: addAnsInput!) { addAnswer(answer: $ans) { answers { _id description } } }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { ans: { tweetId, description: 'hola!' } },
      });

      const tweet = await database.Tweet.getByIdPopulated(tweetId);
      answerId = database.Utils.objectIdToString(tweet.answers[0]._id);

      expect(resultQuery.data.addAnswer).toBeTruthy();
      expect(resultQuery.data.addAnswer.answers[0].description).toEqual('hola!');
      expect(tweet.answers.length).toBe(1);
      expect(tweet.answers[0].description).toEqual('hola!');
      expect(tweet.answers[0].user.username).toEqual(userMock2.username);
    });

    it('updateAnswer() --> should return anwer updated', async () => {
      const query = 'mutation($ans: updateAnsInput!) { updateAnswer(answer: $ans) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { ans: { answerId, tweetId, description: 'hola mundo' } },
      });

      const tweet = await database.Tweet.getById(tweetId);

      expect(resultQuery.data.updateAnswer).toBeTruthy();
      expect(tweet.answers.length).toBe(1);
      expect(tweet.answers[0].description).toEqual('hola mundo');
    });

    it('deleteAnswer() --> should return anwer deleted', async () => {
      const query = 'mutation($ans: delAnsInput!) { deleteAnswer(answer: $ans) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { ans: { answerId, tweetId } },
      });

      const tweet = await database.Tweet.getById(tweetId);

      expect(resultQuery.data.deleteAnswer).toBeTruthy();
      expect(tweet.answers.length).toBe(0);
    });

    it('deleteTweet() --> should return tweet deleted', async () => {
      userToken = database.Utils.objectIdToString(userMock._id);

      const query = 'mutation($id: String!) { deleteTweet(id: $id) }';
      const resultQuery = await server.executeOperation({
        query,
        variables: { id: tweetId },
      });

      const tweet = await database.Tweet.getById(tweetId);

      expect(resultQuery.data.deleteTweet).toBeTruthy();
      expect(tweet).toBeFalsy();
    });
  });
});
