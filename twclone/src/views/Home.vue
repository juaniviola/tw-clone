<template>
  <div>
    <LoadingComponent v-if="loading" />

    <Signin
      v-if="!loading && !userLogged && selectedScreen === 'signin'"
      @changeScreen='screenSelection'/>

    <Signup
      v-if="!loading && !userLogged && selectedScreen === 'signup'"
      @changeScreen='screenSelection'/>

    <Hello v-if="!loading && userLogged && selectedScreen === 'home'" />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Hello from '@/components/HelloWorld.vue';
import LoadingComponent from '@/components/Home/Loading.vue';
import Signin from '@/components/Home/Signin.vue';
import Signup from '@/components/Home/Signup.vue';

export default {
  name: 'Home',

  components: {
    Hello,
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
      } else this.userLogged = false;
    } catch (e) {
      this.userLogged = false;
    } finally {
      this.loading = false;
    }
  },
};
</script>
