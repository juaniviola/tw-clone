<template>
  <div>
    <Header v-if="userLogged" />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/global/Header.vue';
import eventBus from '@/utils/EventBus';

export default {
  data() {
    return {
      userLogged: false,
    };
  },

  components: {
    Header,
  },

  mounted() {
    eventBus.on('user_logged', (isLogged) => {
      this.userLogged = isLogged;
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
