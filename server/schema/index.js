import gqlTools from 'graphql-tools';
import User from './user';
import Tweet from './tweet';
import resolvers from '../resolvers';

const { makeExecutableSchema } = gqlTools;

const rootTypeDef = `
  scalar objectId

  type Query {
    helloWorld: String
    userById(id: objectId!): User
    userByUsername(username: String!): User
    usersByUsername(username: String!): [User!]
    tweetById(id: objectId!): Tweet
    tweetsByUsername(username: String!): [Tweet!]
    tweetsByFollowingUsers(token: String!): [Tweet!]
    tweetsByHashtags(hashtag: String!): [Tweet!]
  }

  type Mutation {
    addUser(u: newUser!): User
    signin(user: login!): UserLogged @deprecated(reason: "Used for tests")
    login(user: login!): String!
    logout(token: String!): String
    addTweet(tw: newTweet!): Tweet
    editTweet(tw: editTweet!): Tweet
    deleteTweet(tw: deleteTweet!): String
    favTweet(fav: favTweet!): Tweet
    delFav(fav: favTweet!): Tweet
    addAnswer(answer: addAnswer!): Tweet
    delAnswer(answer: delAnswer!): Tweet
    addFollow(follow: userFollow!): User
    delFollow(follow: userFollow!): User
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema({
  typeDefs: [rootTypeDef, User, Tweet],
  resolvers,
});
