export default `
  # Type User definition

  type User {
    _id: String!
    username: String!
    fullName: String!
    email: String!
    followers: [User!]
    following: [User!]
  }

  type UserFollower {
    _id: String!
    username: String!
    fullName: String!
  }

  type Follower {
    followers: [UserFollower!]
    following: [UserFollower!]
  }

  input newUser {
    username: String!
    email: String!
    fullName: String!
    password: String!
  }
`;
