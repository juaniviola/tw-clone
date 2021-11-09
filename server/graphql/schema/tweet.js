export default `
  # Type definition for Tweet
  scalar Date

  type Tweet {
    _id: objectId!
    user: User!
    description: String!
    createdAt: Date!
    favs: [User!]
    answers: [Answer!]
    hashtags: [String!]
    mentions: [String!]
  }

  type Answer {
    _id: objectId
    user: User
    description: String
    createdAt: Date
  }

  input newTweet {
    token: String
    description: String
  }

  input editTweet {
    _id: objectId,
    description: String,
    token: String
  }

  input favTweet {
    tweetId: objectId,
    token: String
  }

  input addAnswer {
    tweetId: objectId
    description: String
    token: String
  }

  input delAnswer {
    tweetId: objectId
    answerId: objectId
    token: String
  }

  input deleteTweet {
    tweetId: objectId
    token: String
  }
`;
