export default `
  # Type User definition

  type User {
    _id: objectId!
    username: String!
    fullName: String!
    email: String!
    followers: [User!]
    following: [User!]
  }

  type UserLogged {
    user: User
    secure: String
  }

  input newUser {
    username: String
    email: String
    fullName: String
    password: String
  }

  input login {
    username: String
    password: String
  }

  input userFollow {
    token: String
    userToId: objectId
  }
`;
