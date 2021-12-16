<template>
  <div class="replies">
    <div>
      <span
        class="username"
        @click="goToUserPage"
        >{{ user.username }}</span>
      <span class="date">{{ createdAtFormatted }}</span>
    </div>

    <div class="text">
      <p>{{ description }}</p>
    </div>

    <div :id="_id" class="disabled">
      <button @click="deleteAnswer">
        <img src="/delete.svg" height="24" width="24" />
      </button>
    </div>

    <div id="snackbar" class="disabled">
      <span></span>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import gql from 'graphql-tag';
import moment from 'moment';
import setSnackbar from '@/components/Home/modules/Snackbar';
import globalState from '@/utils/GlobalState';

export default {
  data() {
    return {
      createdAtFormatted: '',
    };
  },

  props: {
    tweetId: String,
    _id: String,
    user: Object,
    description: String,
    createdAt: String,
  },

  methods: {
    goToUserPage() {
      return this.$router.push({ name: 'User', params: { username: this.user.username } });
    },

    setSnackbar(message) { return setSnackbar(message); },

    async deleteAnswer() {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation ($answer: delAnsInput!) {
              deleteAnswer(answer: $answer)
            }
          `,

          variables: {
            answer: {
              tweetId: this.tweetId,
              answerId: this._id,
            },
          },
        });

        this.setSnackbar('Answer deleted');
        this.$emit('deleteAnswer', this._id);
      } catch (error) {
        this.setSnackbar('Error deleting answer');
      }
    },
  },

  mounted() {
    this.createdAtFormatted = moment(this.createdAt).format('MMM Do YY');
    const user = globalState.getUser();
    if (!user || !user._id || user._id !== this.user._id) return;

    document.getElementById(this._id).className = 'delete';
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/TweetReplies.scss";
  @import "./styles/Snackbar.scss";
</style>
