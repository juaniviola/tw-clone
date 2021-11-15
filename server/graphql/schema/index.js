import { gql } from 'apollo-server';
import User from './user';
import Tweet from './tweet';

export default gql`
  ${User}

  ${Tweet}

  type Query {
    hello(name: String): String
    userById(id: String!): User
    userByUsername(username: String!): User
    usersByUsername(username: String!): [User!]
    userFollowers(id: String!): [User!]
    tweetById(id: String!): Tweet
    tweetsByUser(id: String!): [Tweet!]
    tweetsByFollowingUsers(token: String!): [Tweet!]
    tweetsByHashtag(hashtag: String!): [Tweet!]
  }

  type Mutation {
    addUser(user: newUser!): User
    addFollow(userId: String!): Boolean!
    deleteFollow(userId: String!): Boolean!
    addTweet(tweet: addTwInput!): TweetCreated
    editTweet(tweet: editTwInput!): TweetCreated
    deleteTweet(id: String!): Boolean!
    favTweet(fav: favInput!): Boolean!
    addAnswer(answer: addAnsInput!): Tweet
    deleteAnswer(answer: delAnsInput!): Boolean!
    updateAnswer(answer: updateAnsInput!): Tweet
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
