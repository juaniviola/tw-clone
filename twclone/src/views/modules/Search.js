import gql from 'graphql-tag';

const searchUser = (apollo, input) => apollo.query({
  query: gql`
    query ($username: String!) {
      usersByUsername(username: $username) {
        _id
        username
        fullName
      }
    }
  `,

  variables: { username: input },
});

export default {
  searchUser,
};
