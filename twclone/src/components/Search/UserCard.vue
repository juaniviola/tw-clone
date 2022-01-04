<template>
  <div class="user_card">
    <div class="info">
      <h3 @click="goToProfile">{{ fullName }}</h3>
      <span>{{ followers.length }} followers</span>
    </div>

    <div class="follow">
      <button v-if="!following && !sameUser" @click="followUser">
        <img src="/icons/follow.svg" alt="follow" height="20" width="20">
        <span>Follow</span>
      </button>

      <button v-if="following && !sameUser" class="unfollow" @click="unfollowUser">
        <span>Unfollow</span>
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import globalState from '@/utils/GlobalState';
import followUtils from '@/components/global/modules/FollowUser';
import userCardUtils from '@/components/Search/modules/UserCard';

export default {
  data() {
    return {
      followers: [],
      sameUser: false,
      following: false,
    };
  },

  props: {
    _id: String,
    username: String,
    fullName: String,
  },

  methods: {
    goToProfile() {
      return this.$router.push(`/user/${this.username}`);
    },

    async getFollowers() {
      try {
        const followers = await userCardUtils.getFollowers(this.$apollo, this._id);

        this.followers = followers.data?.userFollowers.followers || [];

        const userId = globalState.getUser()._id;
        this.sameUser = userId === this._id;

        const isUserFollowing = this.followers.filter(({ _id }) => _id === userId);
        this.following = isUserFollowing.length === 1;
      } catch (error) {
        this.followers = false;
      }
    },

    async followUser() {
      if (!this._id) return;

      try {
        const followUser = await followUtils.followUser(this.$apollo, this._id);

        if (followUser.data?.addFollow) this.following = true;

        this.followers = [...this.followers, { username: globalState.getUser().username }];
      } catch (error) {
        this.following = false;
      }
    },

    async unfollowUser() {
      if (!this._id) return;

      try {
        const unfollowUser = await followUtils.unfollowUser(this.$apollo, this._id);

        if (unfollowUser.data?.deleteFollow) this.following = false;

        this.followers = this.followers.filter(
          ({ username }) => username !== globalState.getUser().username,
        );
      } catch (error) {
        this.following = true;
      }
    },
  },

  async mounted() {
    await this.getFollowers();
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/UserCard.scss";
</style>
