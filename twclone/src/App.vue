<template>
  <div>
    <Header v-if="userLogged" :username="username" />
    <router-view/>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Header from '@/components/global/Header.vue';
import eventBus from '@/utils/EventBus';

export default {
  data() {
    return {
      userLogged: false,
      username: '',
    };
  },

  components: {
    Header,
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

        if (user.data?.userInfo) {
          this.username = user.data.userInfo.username;
          localStorage.setItem('user', JSON.stringify(user.data.userInfo));
        }
      } catch (error) {
        return null;
      }

      return 0;
    },
  },

  mounted() {
    eventBus.on('user_logged', async (isLogged) => {
      this.userLogged = isLogged;
      if (isLogged) await this.saveUserInfoInStorage();
    });
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
