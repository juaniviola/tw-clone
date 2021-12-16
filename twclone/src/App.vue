<template>
  <div>
    <Header v-if="!loading && userLogged" :username="username" />
    <LoadingComponent v-if="loading" />
    <router-view v-if="!loading"/>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Header from '@/components/global/Header.vue';
import LoadingComponent from '@/components/Welcome/Loading.vue';
import globalState from '@/utils/GlobalState';
import EventBus from '@/utils/EventBus';

export default {
  data() {
    return {
      userLogged: false,
      username: '',
      loading: true,
    };
  },

  components: {
    Header,
    LoadingComponent,
  },

  methods: {
    async saveUserInfoInStorage() {
      try {
        const user = await this.$apollo.query({
          query: gql`
            query {
              userInfo {
                _id
                username
                fullName
              }
            }
          `,
        });

        if (!user.data?.userInfo) return;

        this.userLogged = true;
        this.username = user.data.userInfo.username;
        globalState.setUser(user.data.userInfo);
        globalState.setIsUserLogged(true);
      } catch (error) {
        this.userLogged = false;
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    EventBus.on('userLogged', () => {
      this.userLogged = globalState.isUserLogged;
      this.username = globalState.user.username;
    });
  },

  async mounted() {
    await this.saveUserInfoInStorage();
  },
};
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Lato:wght@300;400&display=swap');

  html, body {
    height: 100%;
    margin: 0;
  }
</style>
