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
    userFollowers(id: String!): Follower
    tweetById(id: String!): Tweet
    tweetsByUser(id: String!): [Tweet!]
    tweetsByFollowingUsers: [Tweet!]
    tweetsByHashtag(hashtag: String!): [Tweet!]
  }

  type Mutation {
    addUser(user: newUser!): User
    addFollow(userId: String!): Boolean!
    deleteFollow(userId: String!): Boolean!
    addTweet(description: String!): TweetCreated
    editTweet(tweet: editTwInput!): TweetCreated
    deleteTweet(id: String!): Boolean!
    favTweet(fav: favInput!): Boolean!
    addAnswer(answer: addAnsInput!): AnswerCreated
    deleteAnswer(answer: delAnsInput!): Boolean!
    updateAnswer(answer: updateAnsInput!): Boolean!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
