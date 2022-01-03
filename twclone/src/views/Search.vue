<template>
  <div class="search">
    <div class="bar">
      <form action="" @submit="searchUsers">
        <input v-model="text" id="text" type="text">
        <button type="submit">Search</button>
      </form>

      <div v-show="loading" class="loading_spinner"></div>

      <div
        v-show="!loading && users.length > 0"
        class="users">
        <UserCard
          v-for="user in users" :key="user._id"
          :_id="user._id"
          :username="user.username"
          :fullName="user.fullName" />
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import UserCard from '@/components/Search/UserCard.vue';

export default {
  data() {
    return {
      loading: false,
      text: '',
      users: [],
    };
  },

  components: {
    UserCard,
  },

  methods: {
    async searchUsers(event) {
      event.preventDefault();

      if (this.text.length <= 3) return;
      this.users = [];

      try {
        this.loading = true;
        const users = await this.$apollo.query({
          query: gql`
            query ($username: String!) {
              usersByUsername(username: $username) {
                _id
                username
                fullName
              }
            }
          `,

          variables: {
            username: this.text,
          },
        });

        this.users = users.data?.usersByUsername || [];
      } catch (error) {
        this.users = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/Search.scss";
  @import "../components/global/styles/loading.scss";
</style>
