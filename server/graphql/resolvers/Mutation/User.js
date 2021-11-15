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
};

export default Mutations;
