import gql from 'graphql-tag';

const getFollowers = (apollo, id) => apollo.query({
  query: gql`
    query ($id: String!) {
      userFollowers(id: $id) {
        followers {
          _id
          username
        }
      }
    }
  `,

  variables: { id },
});

export default {
  getFollowers,
};
