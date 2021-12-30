<template>
  <div class="profile">
    <div class="profile_card">
      <div class="user">
        <div class="info">
          <div class="name">
            <span>{{ user?.fullName || 'nada' }}</span>
          </div>

          <div class="followers">
            <span>
              <span>{{ user.following?.length || 0 }}</span>
              Following
            </span>

            <span>
              <span>{{ user.followers?.length || 0 }}</span>
              Followers
            </span>
          </div>
        </div>

        <div class="description">
          <p>Descripcion para decir algo de esta persona</p>
        </div>
      </div>

      <div class="follow_button" v-show="!sameUser">
        <button v-show="!following" @click="followUser">
          <img src="/follow.svg" alt="follow" height="24" width="24">
          <span>Follow</span>
        </button>

        <button v-show="following" class="unfollow" @click="unfollowUser">
          <span>Unfollow</span>
        </button>
      </div>
    </div>

    <div class="user_feed">
      <div class="selectors">
        <div class="buttons">
          <div id="button_tweets">
            <a href="#" @click="selectFromPanel('tweets')">Tweets</a>
          </div>

          <div id="button_likes">
            <a href="#" @click="selectFromPanel('likes')">Likes</a>
          </div>

          <div id="button_retweets">
            <a href="#" @click="selectFromPanel('retweets')">Retweets</a>
          </div>
        </div>
      </div>

      <div class="tweets">
        <TweetCard
          v-show="tweets.length >= 1"
          v-for="tweet in tweets"
          :key="tweet._id"
          :_id="tweet._id"
          :user="tweet.user"
          :description="tweet.description"
          :favs="tweet.favs"
          :answers="tweet.answers"
          :retweets="tweet.retweets"
          :createdAt="tweet.createdAt"
          @deleteTweet="deleteTweet"
        />

        <div
          v-show="tweets.length === 0"
          class="no_data">
          <span>No hay tweets aún</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TweetCard from '@/components/Home/TweetCard.vue';

export default {
  data() {
    return {
      selected: 'tweets',
    };
  },

  components: {
    TweetCard,
  },

  props: {
    user: Object,
    tweets: Array,
    sameUser: Boolean,
    following: Boolean,
  },

  methods: {
    followUser() {
      return this.$emit('followUser', this.user);
    },

    unfollowUser() {
      return this.$emit('unfollowUser', this.user);
    },

    selectFromPanel(selected) {
      const buttonDivSelected = document.getElementById(`button_${this.selected}`);
      const [buttonSelected] = buttonDivSelected.children;

      const buttonDiv = document.getElementById(`button_${selected}`);
      const [button] = buttonDiv.children;

      buttonDiv.className = 'selectedDiv';
      button.className = 'selectedButtonColor';

      buttonDivSelected.className = '';
      buttonSelected.className = '';

      this.selected = selected;
      this.$emit('selectedPanel', this.selected);
    },

    deleteTweet(id) {
      this.$emit('deleteTweet', id);
    },
  },

  mounted() {
    const buttonDiv = document.getElementById('button_tweets');
    const [button] = buttonDiv.children;

    buttonDiv.className = 'selectedDiv';
    button.className = 'selectedButtonColor';
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/UserCard.scss";
</style>
