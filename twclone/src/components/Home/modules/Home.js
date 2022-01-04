import gql from 'graphql-tag';

const getFeed = (apollo) => apollo.query({
  query: gql`
    query {
      tweetsByFollowingUsers {
        _id
        user {
          _id
          username
        }
        description
        createdAt
        favs
        answers
        retweets
      }
    }
  `,
});

export default {
  getFeed,
};
