import gql from 'graphql-tag';

const isChecked = (array, userId, hasId) => {
  if (hasId) return array.some(({ _id }) => _id === userId);

  return array.some((id) => id === userId);
};

const rtTweet = (id, isRt) => {
  const rtButton = document.getElementById(id.concat('rt'));
  rtButton.className = isRt ? 'retweeted' : '';
};

const favTweet = (id, isFav, favorites) => {
  const likeButton = document.getElementById(id);
  if (isFav) {
    likeButton.className = 'liked';
    likeButton.setAttribute('src', '/icons/like_filled.svg');
    return favorites + 1;
  }

  likeButton.className = '';
  likeButton.setAttribute('src', '/icons/like.svg');
  return favorites - 1;
};

const queryRepliesAndFavorites = (apollo, id) => apollo.query({
  query: gql`
    query ($id: String!) {
      tweetAnswers(id: $id) {
        _id
        user {
          _id
          username
        }
        description
        createdAt
      }

      tweetFavorites(id: $id) {
        _id
      }
    }
  `,

  variables: { id },
});

const mutationSubmitAnswer = (apollo, tweetId, description) => apollo.mutate({
  mutation: gql`
    mutation ($answer: addAnsInput!) {
      addAnswer(answer: $answer) {
        _id
      }
    }
  `,

  variables: {
    answer: { tweetId, description },
  },
});

const mutationLikeTweet = (apollo, id, favorite) => apollo.mutate({
  mutation: gql`
    mutation ($fav: favInput!) {
      favTweet(fav: $fav)
    }
  `,

  variables: {
    fav: { id, favorite },
  },
});

const mutationRtTweet = (apollo, id) => apollo.mutate({
  mutation: gql`
    mutation ($id: String!) {
      addRetweet(id: $id)
    }
  `,

  variables: { id },
});

const mutationDeleteTweet = (apollo, id) => apollo.mutate({
  mutation: gql`
    mutation ($id: String!) {
      deleteTweet(id: $id)
    }
  `,

  variables: { id },
});

export default {
  isChecked,
  rtTweet,
  favTweet,
  queryRepliesAndFavorites,
  mutationSubmitAnswer,
  mutationLikeTweet,
  mutationRtTweet,
  mutationDeleteTweet,
};
