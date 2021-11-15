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

  input newUser {
    username: String!
    email: String!
    fullName: String!
    password: String!
  }

  input login {
    username: String!
    password: String!
  }
`;
