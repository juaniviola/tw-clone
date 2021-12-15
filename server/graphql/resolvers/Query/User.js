/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member   */
import db from '../../../Database/Database';
import wrapAsync from '../modules';

const Querys = {
  hello: (_, { name }) => `Hello ${name || 'World'}`,

  userById: async (_, { id }) => {
    const query = await wrapAsync(db.User.getById, id);
    return query;
  },

  userByUsername: async (_, { username }) => {
    const query = await wrapAsync(db.User.getByUsername, username);
    return query;
  },

  usersByUsername: async (_, { username }) => {
    const query = await wrapAsync(db.User.getUsersByUsername, username);
    return query;
  },

  userFollowers: async (_, { id }) => {
    const query = await wrapAsync(db.User.getFollowers, id);
    return query;
  },

  userLogged: async (_, __, { userToken }) => {
    if (!userToken) return false;

    try {
      const user = await db.User.getById(userToken);
      if (!user || !user.username) throw Error(0);

      return true;
    } catch (error) {
      return false;
    }
  },

  userInfo: async (_, __, { userToken }) => {
    if (!userToken) return null;

    try {
      const user = await db.User.getById(userToken);
      if (!user || !user.username) throw Error(0);

      return user;
    } catch (e) {
      return null;
    }
  },
};

export default Querys;
