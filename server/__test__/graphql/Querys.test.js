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

describe('Querys', () => {
  let server;
  let mockUser;
  let mockUser2;

  beforeAll(async () => {
    // setup db
    const mongod = await connectDb();
    await database.connect(mongod.getUri());

    mockUser = await database.User.saveUser({
      username: 'test_user',
      password: 'p4ssw0rd',
      email: 'test@test.io',
      fullName: 'test test',
    });

    // setup sv
    server = new ApolloServer({
      typeDefs: schema,
      resolvers,
      context: () => ({
        userToken: database.Utils.objectIdToString(mockUser._id),
      }),
    });
  });

  describe('User Querys', () => {
    it('hello() -> it should return string message', async () => {
      const query = 'query ($name: String!){ hello(name: $name) }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { name: 'test' },
      });

      expect(resultQuery.data.hello).toEqual('Hello test');
    });

    it('userById() --> it should return mockUser', async () => {
      const query = `
        query ($id: String!){
          userById(id: $id) {
            username
            email
            fullName
          }
        }
      `;

      const resultQuery = await server.executeOperation({
        query,
        variables: { id: database.Utils.objectIdToString(mockUser._id) },
      });

      expect(resultQuery).toBeTruthy();
      expect(resultQuery.data.userById).toBeTruthy();
      expect(resultQuery.data.userById.username).toEqual(mockUser.username);
      expect(resultQuery.data.userById.email).toEqual(mockUser.email);
      expect(resultQuery.data.userById.fullName).toEqual(mockUser.fullName);
    });

    it('userByUsername() --> it should return mockUser', async () => {
      const query = `
        query ($username: String!){
          userByUsername(username: $username) {
            username
            email
            fullName
          }
        }
      `;

      const resultQuery = await server.executeOperation({
        query,
        variables: { username: mockUser.username },
      });

      expect(resultQuery).toBeTruthy();
      expect(resultQuery.data.userByUsername).toBeTruthy();
      expect(resultQuery.data.userByUsername.username).toEqual(mockUser.username);
      expect(resultQuery.data.userByUsername.email).toEqual(mockUser.email);
      expect(resultQuery.data.userByUsername.fullName).toEqual(mockUser.fullName);
    });

    it('usersByUsername() --> it should return [mockUser]', async () => {
      mockUser2 = await database.User.saveUser({
        username: 'prueba_user',
        password: 'p4ssw0rd',
        email: 'test@testing.io',
        fullName: 'test test',
      });

      const query = 'query ($username: String!){ usersByUsername(username: $username) { username } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { username: 'test' },
      });

      expect(resultQuery).toBeTruthy();
      expect(resultQuery.data.usersByUsername.length).toBe(1);
      expect(resultQuery.data.usersByUsername[0].username).toEqual(mockUser.username);
    });

    it('userFollowers() --> it should return mockUser following mockUser2', async () => {
      await database.User.addFollower({ userFromId: mockUser._id, userToId: mockUser2._id });

      const query = `
        query ($id: String!){
          userFollowers(id: $id) {
            followers {
              username
            }
            following {
              username
            }
          }
        }`;

      const resultQuery = await server.executeOperation({
        query,
        variables: { id: database.Utils.objectIdToString(mockUser2._id) },
      });

      expect(resultQuery.data).toBeTruthy();
      expect(resultQuery.data.userFollowers).toBeTruthy();
      expect(resultQuery.data.userFollowers.followers.length).toBe(1);
      expect(resultQuery.data.userFollowers.followers[0].username).toEqual(mockUser.username);
    });
  });

  describe('Tweet Querys', () => {
    let tweetId;

    it('tweetById() --> it should return tweet created', async () => {
      const tweet = await database.Tweet.saveTweet({ user: mockUser2._id, description: 'hola #mundo' });
      tweetId = database.Utils.objectIdToString(tweet._id);

      const query = 'query($id: String!) { tweetById(id: $id) { user { username } description hashtags favs } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { id: database.Utils.objectIdToString(tweet._id) },
      });

      expect(resultQuery.data.tweetById).toBeTruthy();
      expect(resultQuery.data.tweetById.user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetById.description).toEqual(tweet.description);
      expect(resultQuery.data.tweetById.hashtags[0]).toEqual('#mundo');
      expect(resultQuery.data.tweetById.favs).toBe(0);
    });

    it('tweetsByUser() --> it should return 2 tweets by mockUser', async () => {
      const tweet = await database.Tweet.saveTweet({ user: mockUser2._id, description: 'hello #mundo' });

      const query = 'query($id: String!) { tweetsByUser(id: $id) { user { username } description } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { id: database.Utils.objectIdToString(mockUser2._id) },
      });

      expect(resultQuery.data.tweetsByUser).toBeTruthy();
      expect(resultQuery.data.tweetsByUser.length).toBe(2);
      expect(resultQuery.data.tweetsByUser[0].user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetsByUser[1].user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetsByUser[0].description).toEqual(tweet.description);
      expect(resultQuery.data.tweetsByUser[1].description).toEqual('hola #mundo');
    });

    it('tweetsByHashtag() --> it should return 2 tweets by mockUser', async () => {
      await database.Tweet.saveTweet({ user: mockUser2._id, description: 'hello #mundi' });

      const query = 'query($htg: String!) { tweetsByHashtag(hashtag: $htg) { user { username } description } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { htg: '#mundo' },
      });

      expect(resultQuery.data.tweetsByHashtag).toBeTruthy();
      expect(resultQuery.data.tweetsByHashtag.length).toBe(2);
      expect(resultQuery.data.tweetsByHashtag[0].user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetsByHashtag[1].user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetsByHashtag[0].description).toEqual('hello #mundo');
      expect(resultQuery.data.tweetsByHashtag[1].description).toEqual('hola #mundo');
    });

    it('tweetsByHashtag() --> it should return 2 tweets by mockUser', async () => {
      await database.Tweet.saveTweet({ user: mockUser2._id, description: 'hello #mundi' });

      const query = 'query($htg: String!) { tweetsByHashtag(hashtag: $htg) { user { username } description } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { htg: '#mundo' },
      });

      expect(resultQuery.data.tweetsByHashtag).toBeTruthy();
      expect(resultQuery.data.tweetsByHashtag.length).toBe(2);
      expect(resultQuery.data.tweetsByHashtag[0].user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetsByHashtag[1].user.username).toEqual(mockUser2.username);
      expect(resultQuery.data.tweetsByHashtag[0].description).toEqual('hello #mundo');
      expect(resultQuery.data.tweetsByHashtag[1].description).toEqual('hola #mundo');
    });

    it('tweetsByFollowingUsers() --> it should return 5 tweets by mockUser2', async () => {
      // add 2 mockUsers
      const mockUser3 = await database.User.saveUser({
        username: 'user_test3',
        password: 'p4ssw0rd',
        email: 'test@test3.io',
        fullName: 'test test',
      });

      const mockUser4 = await database.User.saveUser({
        username: 'prueba_user4',
        password: 'p4ssw0rd',
        email: 'test@test4.io',
        fullName: 'test test',
      });

      // create tweet for each mockUser
      await database.Tweet.saveTweet({ user: mockUser3._id, description: 'hola desde casa' });
      await database.Tweet.saveTweet({ user: mockUser4._id, description: 'hello from home' });
      await database.Tweet.saveTweet({ user: mockUser._id, description: 'test 1' });

      // mockUser follow mockUser3
      await database.User.addFollower({ userFromId: mockUser._id, userToId: mockUser3._id });
      await database.User.addFollower({ userFromId: mockUser4._id, userToId: mockUser._id });

      const query = `
        query {
          tweetsByFollowingUsers {
            user { username }
            description
          }
        }`;

      const resultQuery = await server.executeOperation({ query });

      expect(resultQuery.data.tweetsByFollowingUsers).toBeTruthy();
      expect(resultQuery.data.tweetsByFollowingUsers.length).toBe(5);
      expect(
        resultQuery.data.tweetsByFollowingUsers.filter(
          ({ user }) => user.username === mockUser.username
          || user.username === mockUser4.username,
        ).length,
      ).toEqual(0);
    });

    it('tweetFavorites() --> it should return favs', async () => {
      await database.Tweet.favorite({
        tweetId,
        fav: true,
        userId: database.Utils.objectIdToString(mockUser._id),
      });
      await database.Tweet.favorite({
        tweetId,
        fav: true,
        userId: database.Utils.objectIdToString(mockUser2._id),
      });

      const query = 'query($id: String!) { tweetFavorites(id: $id) { username } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { id: tweetId },
      });

      expect(resultQuery.data.tweetFavorites).toBeTruthy();
      expect(resultQuery.data.tweetFavorites.length).toBe(2);
    });

    it('tweetFavorites() --> it should return favs', async () => {
      await database.Tweet.addAnswer({
        tweetId,
        description: 'true',
        userId: database.Utils.objectIdToString(mockUser._id),
      });
      await database.Tweet.addAnswer({
        tweetId,
        description: 'false',
        userId: database.Utils.objectIdToString(mockUser2._id),
      });

      const query = 'query($id: String!) { tweetAnswers(id: $id) { user { username } description } }';

      const resultQuery = await server.executeOperation({
        query,
        variables: { id: tweetId },
      });

      expect(resultQuery.data.tweetAnswers).toBeTruthy();
      expect(resultQuery.data.tweetAnswers.length).toBe(2);
    });
  });
});
