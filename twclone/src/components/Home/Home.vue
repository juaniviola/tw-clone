<template>
  <div class="home">
    <TweetInput />

    <div
      v-show="!loading && !error && tweets.length === 0"
      class="empty_tweet">
      <span>No hay tweet para mostrar</span>
    </div>

    <div v-show="loading" class="loading_spinner"></div>

    <TweetCard
      v-show="!loading && !error && tweets.length >= 1"
      v-for="tweet in tweets" :key="tweet._id"
      :_id="tweet._id"
      :user="tweet.user"
      :description="tweet.description"
      :createdAt="tweet.createdAt"
      :favs="tweet.favs"
      :answers="tweet.answers"
      :retweets="tweet.retweets"
      @deleteTweet="deleteTweet"
    />

    <div id="snackbar" class="disabled">
      <span></span>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import TweetInput from '@/components/Home/TweetInput.vue';
import TweetCard from '@/components/global/TweetCard.vue';
import setSnackbar from '@/components/global/modules/Snackbar';
import homeUtils from '@/components/Home/modules/Home';

export default {
  data() {
    return {
      tweets: [],
      loading: true,
    };
  },

  components: {
    TweetInput,
    TweetCard,
  },

  methods: {
    setSnackbar(message) { return setSnackbar(message); },

    deleteTweet(id) {
      this.tweets = this.tweets.filter(({ _id }) => _id !== id);
    },

    async getFeed() {
      try {
        const result = await homeUtils.getFeed(this.$apollo);

        this.tweets = result.data?.tweetsByFollowingUsers;
        this.tweets = this.tweets.map((tweet) => ({
          ...tweet,
          createdAt: moment(tweet.createdAt).format('MMM Do YY'),
        }));
      } catch (e) {
        this.setSnackbar('Error al cargar :(');
      } finally {
        this.loading = false;
      }
    },
  },

  async mounted() {
    await this.getFeed();
  },
};
</script>

<style scoped lang="scss">
  @import "./styles/Home.scss";
  @import "../global/styles/loading.scss";
</style>
