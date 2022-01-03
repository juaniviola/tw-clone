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
import gql from 'graphql-tag';
import Replies from '@/components/Home/TweetReplies.vue';
import setSnackbar from '@/components/Home/modules/Snackbar';
import globalState from '@/utils/GlobalState';

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

  methods: {
    goToUserPage() {
      return this.$router.push({ name: 'User', params: { username: this.user.username } });
    },

    setSnackbar(message) { return setSnackbar(message); },

    isLiked(favorites) {
      const image = document.getElementById(this._id);
      const userId = globalState.getUser()._id;

      favorites.forEach((favs) => {
        if (favs._id === userId) {
          image.className = 'liked';
          image.setAttribute('src', '/like_filled.svg');
          this.liked = true;
        }
      });
    },

    isRetweeted(rts) {
      const button = document.getElementById(this._id.concat('rt'));
      const userId = globalState.getUser()._id;

      rts.forEach((rt) => {
        if (rt === userId) {
          button.className = 'retweeted';
          this.retweeted = true;
        }
      });
    },

    async getRepliesAndFavorites() {
      try {
        const getRepliesAndFavs = await this.$apollo.query({
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

          variables: {
            id: this._id,
          },
        });

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
        const newAnswer = await this.$apollo.mutate({
          mutation: gql`
            mutation ($answer: addAnsInput!) {
              addAnswer(answer: $answer) {
                _id
              }
            }
          `,

          variables: {
            answer: {
              tweetId: this._id,
              description: this.answer,
            },
          },
        });

        if (!newAnswer.data?.addAnswer._id) throw Error(0);

        this.setSnackbar('Respuesta enviada!');
        this.comments += 1;
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
        await this.$apollo.mutate({
          mutation: gql`
            mutation ($fav: favInput!) {
              favTweet(fav: $fav)
            }
          `,

          variables: {
            fav: {
              id: this._id,
              favorite: !this.liked,
            },
          },
        });

        this.liked = !this.liked;
        this.setSnackbar('Tweet liked ❤');

        const likeButton = document.getElementById(this._id);
        if (this.liked) {
          likeButton.className = 'liked';
          likeButton.setAttribute('src', '/like_filled.svg');
          this.favorites += 1;
        } else {
          likeButton.className = '';
          likeButton.setAttribute('src', '/like.svg');
          this.favorites -= 1;
        }
      } catch (error) {
        this.setSnackbar('Error :(');
      }
    },

    async rtTweet() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation ($id: String!) {
              addRetweet(id: $id)
            }
          `,

          variables: {
            id: this._id,
          },
        });

        this.retweeted = !this.retweeted;
        this.setSnackbar('Tweet retweeted');

        const rtButton = document.getElementById(this._id.concat('rt'));
        if (this.retweeted) rtButton.className = 'retweeted';
        else rtButton.className = '';
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
        const tweetDeleted = await this.$apollo.mutate({
          mutation: gql`
            mutation ($id: String!) {
              deleteTweet(id: $id)
            }
          `,

          variables: {
            id: this._id,
          },
        });

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
