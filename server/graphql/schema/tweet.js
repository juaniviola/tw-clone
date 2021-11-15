export default `
  # Type definition for Tweet
  scalar Date

  type Tweet {
    _id: String!
    user: User!
    description: String!
    createdAt: Date!
    favs: [User!]
    answers: [Answer!]
    hashtags: [String!]
    mentions: [String!]
  }

  type Answer {
    _id: String
    user: User
    description: String
    createdAt: Date
  }

  type TweetCreated {
    _id: String!
    user: String!
    description: String!
    createdAt: Date!
  }

  type AnswerCreatedAndUpdated {
    description: String!
    createdAt: String!
  }

  type AnswerCreated {
    answers: AnswerCreatedAndUpdated!
  }

  # create tweet input
  input addTwInput {
    user: String!
    description: String!
  }

  # update tweet input
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
