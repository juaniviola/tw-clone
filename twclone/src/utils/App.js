import gql from 'graphql-tag';

const getUserInfo = (apollo) => apollo.query({
  query: gql`
    query {
      userInfo {
        _id
        username
        fullName
      }
    }
  `,
});

export default {
  getUserInfo,
};
