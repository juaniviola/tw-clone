import gql from 'graphql-tag';

const followUser = (apollo, userId) => apollo.mutate({
  mutation: gql`
    mutation ($userId: String!) {
      addFollow(userId: $userId)
    }
  `,

  variables: { userId },
});

const unfollowUser = (apollo, userId) => apollo.mutate({
  mutation: gql`
    mutation ($userId: String!) {
      deleteFollow(userId: $userId)
    }
  `,

  variables: { userId },
});

export default {
  followUser,
  unfollowUser,
};
