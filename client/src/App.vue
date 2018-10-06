<template>
  <div id="app">
    <v-app>
      <v-toolbar dark class="secondary">
        <v-toolbar-title class="white--text">🐦</v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-show="isLogged">
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>

          <v-menu bottom origin="center center" transition="scale-transition">
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click="test">
                <v-list-tile-title>Juani Viola</v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click="logout">
                <v-list-tile-title>Salir <v-icon>close</v-icon></v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </v-toolbar>

      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import userUtil from './utils/userLogin'
import { mapState } from 'vuex'

export default {
  name: 'app',

  methods: {
    test () {
      console.log('test...')
    },

    logout () {
      localStorage.clear()
      this.$store.commit('setLogged', false)
      this.$router.push('signin')
    }
  },

  computed: {
    ...mapState(['isLogged'])
  },

  created () {
    this.$store.commit('setLogged', userUtil.isUserLogged())
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
