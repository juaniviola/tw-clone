<template>
  <div class="profile">
    <div v-show="loading" class="loading_spinner"></div>

    <UserNotFound
      v-show="!loading && !user.username"
    />

    <UserCard
      class="user_card"
      v-show="!loading && user.username"
      :tweets="tweets"
      :user="user"
      :sameUser="sameUser"
      :following="following"
      @followUser="followUser"
      @unfollowUser="unfollowUser"
      @deleteTweet="deleteTweet"
      @selectedPanel="getTweets"
    />
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import UserCard from '@/components/User/UserCard.vue';
import UserNotFound from '@/components/User/UserNotFound.vue';
import globalState from '@/utils/GlobalState';
import followUtils from '@/components/global/modules/FollowUser';
import userUtils from '@/views/modules/User';

export default {
  data() {
    return {
      loading: true,
      tweets: [],
      user: {},
      followers: {},
      sameUser: false,
      following: false,
    };
  },

  components: {
    UserCard,
    UserNotFound,
  },

  methods: {
    async followUser() {
      if (!this.user || !this.user._id) return;

      try {
        const followUser = await followUtils.followUser(this.$apollo, this.user._id);

        if (followUser.data?.addFollow) this.following = true;

        this.user.followers = [...this.user.followers, {
          username: globalState.getUser().username,
        }];
      } catch (error) {
        this.following = false;
      }
    },

    async unfollowUser() {
      if (!this.user || !this.user._id) return;

      try {
        const unfollowUser = await followUtils.unfollowUser(this.$apollo, this.user._id);

        if (unfollowUser.data?.deleteFollow) this.following = false;

        this.user.followers = this.user.followers.filter(
          (user) => user.username !== globalState.getUser().username,
        );
      } catch (error) {
        this.following = true;
      }
    },

    async getTweets(type) {
      try {
        const tweets = await userUtils.getPanelTweet(this.$apollo, type, this.user._id);
        this.tweets = [...tweets];
      } catch (error) {
        this.tweets = [];
      }
    },

    async getInfoAndFollowers() {
      const { username } = this.$route.params;

      try {
        const { user, tweets } = await userUtils.getInfoAndFollowers(this.$apollo, username);
        this.user = user || {};
        this.tweets = tweets || [];

        // check if is same user
        if (this.user.username === globalState.getUser().username) this.sameUser = true;

        // check if is following
        if (this.user.followers?.some((x) => x.username === globalState.user.username)) {
          this.following = true;
        }
      } catch (error) {
        this.user = {};
        this.tweets = [];
        this.following = false;
      } finally {
        this.loading = false;
      }
    },

    deleteTweet(id) {
      this.tweets = this.tweets.filter(({ _id }) => _id !== id);
    },
  },

  async mounted() {
    await this.getInfoAndFollowers();
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/User.scss";
  @import "../components/global/styles/loading.scss";
</style>
