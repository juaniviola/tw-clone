<template>
  <div>
    <Header
      v-if="!loading && this.route !== 'login'"
      :username="username"
      :userLogged="userLogged" />
    <LoadingComponent v-show="loading" />
    <router-view :key="key" v-if="!loading"/>
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
      key: this.$route.path,
      userLogged: false,
      username: '',
      loading: true,
      route: '',
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
      this.route = 'home';
    });

    EventBus.on('selectedScreen', (screen) => {
      this.route = screen;
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
    box-sizing: border-box;
  }
</style>
