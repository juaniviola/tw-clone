import { gql } from 'apollo-server';
import User from './user';
import Tweet from './tweet';

export default gql`
  ${User}

  ${Tweet}

  scalar objectId

  type Query {
    hello(name: String): String
    userById(id: objectId!): User
    userByUsername(username: String!): User
    usersByUsername(username: String!): [User!]
    userFollowers(id: objectId!): [User!]
    tweetById(id: objectId!): Tweet
    tweetsByUsername(username: String!): [Tweet!]
    tweetsByFollowingUsers(token: String!): [Tweet!]
    tweetsByHashtag(hashtag: String!): [Tweet!]
  }

  type Mutation {
    addUser(u: newUser!): User
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
