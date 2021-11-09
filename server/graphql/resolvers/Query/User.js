/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import db from '../Database';
import wrapAsync from '../modules';

const Querys = {
  hello: (_, { name }) => `Hello ${name || 'World'}`,
  userById: (_, { id }) => wrapAsync(db.User.getById, id),
  userByUsername: (_, { username }) => wrapAsync(db.User.getByUsername, username),
  usersByUsername: (_, { username }) => wrapAsync(db.User.getUsersByUsername, username),
  userFollowers: (_, { id }) => wrapAsync(db.User.getFollowers, id),
};

export default Querys;
