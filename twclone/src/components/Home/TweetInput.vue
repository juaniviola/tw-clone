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
import setSnackbar from '@/components/global/modules/Snackbar';
import inputUtils from '@/components/Home/modules/TweetInput';

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
    setLoadingForm(isLoading) { return inputUtils.domSetLoading(isLoading); },

    setSnackbar(message) { return setSnackbar(message); },

    async createTweet() {
      if (!this.tweet || this.tweet.length > 280) return;

      this.setLoadingForm(true);

      try {
        await inputUtils.mutationCreateTweet(this.$apollo, this.tweet);

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
