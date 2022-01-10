<template>
  <div>
    <Signin
      v-if="!userLogged && selectedScreen === 'signin'"
      @changeScreen='screenSelection'/>

    <Signup
      v-if="!userLogged && selectedScreen === 'signup'"
      @changeScreen='screenSelection'/>

    <Home v-if="userLogged && selectedScreen === 'home'" />
  </div>
</template>

<script>
import Home from '@/components/Home/Home.vue';
import Signin from '@/components/Welcome/Signin.vue';
import Signup from '@/components/Welcome/Signup.vue';
import globalState from '@/utils/GlobalState';
import EventBus from '@/utils/EventBus';

export default {
  name: 'Welcome',

  components: {
    Home,
    Signin,
    Signup,
  },

  data() {
    return {
      userLogged: false,
      selectedScreen: 'signup',
    };
  },

  methods: {
    screenSelection(selected) {
      this.selectedScreen = selected;

      if (selected === 'home') {
        this.userLogged = true;
        EventBus.emit('userLogged');
        return;
      }

      EventBus.emit('selectedScreen', 'login');
    },
  },

  created() {
    EventBus.on('home/logout', () => {
      this.userLogged = false;
      this.screenSelection('signup');
    });
  },

  mounted() {
    this.userLogged = globalState.getUserIsLogged();
    if (this.userLogged) {
      this.selectedScreen = 'home';
      return;
    }

    EventBus.emit('selectedScreen', 'login');
  },
};
</script>
