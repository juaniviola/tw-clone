<template>
  <div>
    <LoadingComponent v-if="loading" />

    <Signin
      v-if="!loading && !userLogged && selectedScreen === 'signin'"
      @changeScreen='screenSelection'/>

    <Signup
      v-if="!loading && !userLogged && selectedScreen === 'signup'"
      @changeScreen='screenSelection'/>

    <Home v-if="!loading && userLogged && selectedScreen === 'home'" />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Home from '@/components/Home/Home.vue';
import LoadingComponent from '@/components/Welcome/Loading.vue';
import Signin from '@/components/Welcome/Signin.vue';
import Signup from '@/components/Welcome/Signup.vue';
import eventBus from '@/utils/EventBus';

export default {
  name: 'Welcome',

  components: {
    Home,
    Signin,
    Signup,
    LoadingComponent,
  },

  data() {
    return {
      loading: true,
      userLogged: false,
      selectedScreen: 'signup',
    };
  },

  methods: {
    screenSelection(selected) {
      this.selectedScreen = selected;

      if (selected === 'home') this.userLogged = true;
    },
  },

  async created() {
    try {
      const query = await this.$apollo.query({ query: gql`query { userLogged }` });

      if (query.data.userLogged) {
        this.userLogged = true;
        this.selectedScreen = 'home';
        eventBus.emit('user_logged', true);
      } else this.userLogged = false;
    } catch (e) {
      this.userLogged = false;
    } finally {
      this.loading = false;
    }
  },
};
</script>
