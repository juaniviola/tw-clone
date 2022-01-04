<template>
  <div class="card">
    <div class="nickname">
      <span
        class="name"
        @click="goToUserPage"
        >{{ user.username }}</span><br>
      <span class="date">{{ createdAt }}</span>
    </div>

    <div class="tweet"><p>{{ description }}</p></div>

    <div class="numbers">
      <span class="comments">{{ comments }} comment(s)</span>
      <span class="favs">{{ favorites }} like(s)</span>
    </div>

    <div class="line"></div>

    <div class="buttons">
      <button @click="rtTweet">
        <img
          :id="rtId"
          src="/icons/retweet.svg"
          alt="retweet"
          width="24"
          height="24">
      </button>

      <button @click="likeTweet">
        <img
          :id="_id"
          src="/icons/like.svg"
          alt="like"
          width="24"
          height="24">
      </button>

      <button v-if="owner" @click="deleteTweet">
        <img src="/icons/delete.svg" alt="comment" width="24" height="24">
      </button>
    </div>

    <div class="line"></div>

    <div class="reply">
      <input
        id="tweet_input"
        type="text"
        placeholder="Tweet your reply"
        v-model="answer"
        @keyup.enter="submitAnswer">
    </div>

    <div class="line"></div>

    <div class="replies" v-if="replies.length > 0">
      <Replies
        v-for="reply in replies" :key="reply._id"
        :tweetId="_id"
        :_id="reply._id"
        :user="reply.user"
        :description="reply.description"
        :createdAt="reply.createdAt"
        @deleteAnswer="deleteAnswer"
      />
    </div>

    <div id="snackbar" class="disabled">
      <span></span>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import Replies from '@/components/global/TweetReplies.vue';
import setSnackbar from '@/components/global/modules/Snackbar';
import globalState from '@/utils/GlobalState';
import tweetModules from '@/components/global/modules/TweetCard';

export default {
  data() {
    return {
      replies: [],
      answer: '',
      liked: false,
      retweeted: false,
      owner: false,
      favorites: this.favs,
      comments: this.answers,
      rtId: '',
    };
  },

  props: {
    _id: String,
    user: Object,
    description: String,
    createdAt: String,
    favs: Number,
    answers: Number,
    retweets: Array,
  },

  components: {
    Replies,
  },

  watch: {
    comments() {
      return this.comments;
    },
  },

  methods: {
    goToUserPage() {
      return this.$router.push({ name: 'User', params: { username: this.user.username } });
    },

    setSnackbar(message) { return setSnackbar(message); },

    isLiked(favorites) {
      const userId = globalState.getUser()._id;

      if (tweetModules.isChecked(favorites, userId, true)) {
        this.liked = true;
        tweetModules.favTweet(this._id, this.liked, this.favorites);
      }
    },

    isRetweeted(rts) {
      const userId = globalState.getUser()._id;

      if (tweetModules.isChecked(rts, userId, false)) {
        this.retweeted = true;
        tweetModules.rtTweet(this._id, true);
      }
    },

    async getRepliesAndFavorites() {
      try {
        const getRepliesAndFavs = await tweetModules.queryRepliesAndFavorites(
          this.$apollo,
          this._id,
        );

        this.replies = getRepliesAndFavs.data?.tweetAnswers;
        this.isLiked(getRepliesAndFavs.data?.tweetFavorites);
      } catch (error) {
        this.replies = [];
      }
    },

    async submitAnswer() {
      if (!this.answer) return;

      const user = globalState.getUser();
      const input = document.getElementById('tweet_input');
      input.disabled = true;

      try {
        const newAnswer = await tweetModules.mutationSubmitAnswer(
          this.$apollo,
          this._id,
          this.answer,
        );
        if (!newAnswer.data?.addAnswer._id) throw Error(0);

        this.setSnackbar('Respuesta enviada!');
        this.comments += 1;

        // add replie
        this.replies = [
          ...this.replies, {
            createdAt: `${new Date()}`,
            description: this.answer,
            _id: newAnswer.data.addAnswer._id,
            user,
          }];
      } catch (error) {
        this.setSnackbar('Error :(');
      } finally {
        input.disabled = false;
        this.answer = '';
      }
    },

    async likeTweet() {
      try {
        await tweetModules.mutationLikeTweet(this.$apollo, this._id, !this.liked);

        this.liked = !this.liked;
        this.setSnackbar('Tweet liked ❤');

        this.favorites = tweetModules.favTweet(this._id, this.liked, this.favorites);
      } catch (error) {
        this.setSnackbar('Error :(');
      }
    },

    async rtTweet() {
      try {
        await tweetModules.mutationRtTweet(this.$apollo, this._id);

        this.retweeted = !this.retweeted;
        this.setSnackbar('Tweet retweeted');

        tweetModules.rtTweet(this._id, this.retweeted);
      } catch (error) {
        this.setSnackbar('Error :(');
      }
    },

    deleteAnswer(value) {
      this.replies = this.replies.filter(({ _id }) => _id !== value);
      this.comments -= 1;
    },

    async deleteTweet() {
      try {
        const tweetDeleted = await tweetModules.mutationDeleteTweet(this.$apollo, this._id);

        if (tweetDeleted.data?.deleteTweet) {
          this.$emit('deleteTweet', this._id);
          this.setSnackbar('Tweet deleted');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },

  created() {
    this.rtId = this._id.concat('rt');
  },

  async mounted() {
    // check if is retweeted
    this.isRetweeted(this.retweets);

    await this.getRepliesAndFavorites();

    const user = globalState.getUser();
    if (!user || !user._id) return;

    if (user._id === this.user._id) this.owner = true;
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/TweetCard.scss";
  @import "./styles/Snackbar.scss";
</style>
