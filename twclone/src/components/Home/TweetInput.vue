<template>
  <div class="tweetinput">
    <span>Tweet something</span>

    <div class="line"></div>

    <div class="input">
      <textarea
        name="inp"
        id="inpt"
        placeholder="What's happening?"
        v-model="tweet"
        @keyup.enter="createTweet"
      >
      </textarea>
    </div>

    <div class="footer">
      <span>{{ tweetLength }}</span>

      <button id="tweet_btn" @click="createTweet">
        <div class="disabled"></div>
        <span>Tweet</span>
      </button>
    </div>

    <div id="snackbar" class="disabled">
      <span></span>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import setSnackbar from '@/components/global/modules/Snackbar';

export default {
  data() {
    return {
      tweet: '',
    };
  },

  computed: {
    tweetLength() {
      return 280 - this.tweet.length;
    },
  },

  methods: {
    setLoadingForm(isLoading) {
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
    },

    setSnackbar(message) { return setSnackbar(message); },

    async createTweet() {
      if (!this.tweet || this.tweet.length > 280) return;

      this.setLoadingForm(true);

      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation ($description: String!) {
              addTweet(description: $description) {
                description
              }
            }
          `,

          variables: {
            description: this.tweet,
          },
        });

        this.setSnackbar('Tweet creado!');
      } catch (error) {
        this.setSnackbar('Error :(');
      } finally {
        this.tweet = '';
        this.setLoadingForm(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/tweetInput.scss";
  @import "../global/styles/Snackbar.scss";
</style>
