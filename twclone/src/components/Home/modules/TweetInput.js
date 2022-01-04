import gql from 'graphql-tag';

const domSetLoading = (isLoading) => {
  const input = document.getElementById('inpt');
  const button = document.getElementById('tweet_btn');
  const [loader, text] = button.children;

  if (isLoading) {
    input.disabled = true;
    button.disabled = true;
    loader.className = 'loading_btn';
    text.className = 'disabled';
    return;
  }

  input.disabled = false;
  button.disabled = false;
  loader.className = 'disabled';
  text.className = '';
};

const mutationCreateTweet = (apollo, tweet) => apollo.mutate({
  mutation: gql`
    mutation ($description: String!) {
      addTweet(description: $description) {
        description
      }
    }
  `,

  variables: { description: tweet },
});

export default {
  mutationCreateTweet,
  domSetLoading,
};
