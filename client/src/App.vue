<template>
  <div id="app">
    <v-app>
      <v-toolbar dark class="secondary">
        <v-toolbar-title class="white--text">🐦</v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-show="logged">
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </div>
      </v-toolbar>

      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import userUtil from './utils/userLogin'

export default {
  name: 'app',

  data () {
    return {
      logged: false
    }
  },

  created () {
    this.logged = userUtil.isUserLogged()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
