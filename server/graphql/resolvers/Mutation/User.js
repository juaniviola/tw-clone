/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import db from '../../../Database/Database';

const Mutations = {
  addUser: async (_, { user }) => {
    try {
      const newUser = await db.User.saveUser(user);
      return newUser;
    } catch (err) {
      return null;
    }
  },

  addFollow: async (_, { userId }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const followAdd = await db.User.addFollower({
        userFromId: db.Utils.stringToObjectId(userToken),
        userToId: db.Utils.stringToObjectId(userId),
      });

      if (!followAdd[0] || !followAdd[1]) throw Error(0);

      return true;
    } catch (error) {
      return false;
    }
  },

  deleteFollow: async (_, { userId }, { userToken }) => {
    try {
      if (!userToken) throw Error(0);

      const delFollow = await db.User.deleteFollower({
        userFromId: db.Utils.stringToObjectId(userToken),
        userToId: db.Utils.stringToObjectId(userId),
      });

      if (!delFollow[0] || !delFollow[1]) throw Error(0);

      return true;
    } catch (error) {
      return false;
    }
  },
};

export default Mutations;
