export default `
  # Type definition for Tweet
  scalar Date

  type Tweet {
    _id: String!
    user: User!
    description: String!
    createdAt: Date!
    favs: Int!
    answers: Int!
    retweets: [String!]
    hashtags: [String!]
    mentions: [String!]
  }

  type Answer {
    _id: String
    user: User
    description: String
    createdAt: Date
  }

  type Favorite {
    _id: String!
    username: String!
    fullName: String!
  }

  # type for update tweet
  type TweetCreated {
    _id: String!
    user: String!
    description: String!
    createdAt: Date!
  }

  # type for update or add answer
  type AnswerCreatedAndUpdated {
    _id: String!
    user: String!
    description: String!
    createdAt: String!
  }

  type AnswerCreated {
    answers: [AnswerCreatedAndUpdated!]
  }

  # tweet inputs
  input addTwInput {
    user: String!
    description: String!
  }

  input editTwInput {
    _id: String!
    description: String!
  }

  # fav or unfav tweet input
  input favInput {
    id: String!
    favorite: Boolean!
  }

  # answer tweet inputs
  input addAnsInput {
    tweetId: String!
    description: String!
  }

  input delAnsInput {
    tweetId: String!
    answerId: String!
  }

  input updateAnsInput {
    tweetId: String!
    answerId: String!
    description: String!
  }
`;
