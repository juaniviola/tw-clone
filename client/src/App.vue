<template>
  <div id="app">
    <v-app>
      <v-toolbar v-show="isLogged" dark class="secondary">
        <v-toolbar-title class="white--text"><span class="bird" @click="home">🐦</span></v-toolbar-title>

        <v-spacer></v-spacer>

        <div>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>

          <v-menu bottom origin="center center" transition="scale-transition">
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click="profile">
                <v-list-tile-title>Juani Viola</v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click="logout">
                <v-list-tile-title>Salir</v-list-tile-title>
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
import utils from './utils/utils'
import { mapState } from 'vuex'

export default {
  name: 'app',

  methods: {
    home () {
      return this.$router.push({ name: 'home' })
    },

    profile () {
      if (!this.user) return

      const user = this.user.username

      return this.$router.push({ name: 'user', params: { username: user } })
    },

    logout () {
      this.$store.dispatch('logout')
      this.$router.push('signin')
    }
  },

  computed: {
    ...mapState(['isLogged', 'user'])
  },

  created () {
    this.$store.commit('setLogged', userUtil.isUserLogged())

    const user = utils.getUserInfo()
    if (!user || !user.user || !user.user.username) return

    this.$store.commit('setUser', user.user)
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

.bird:hover {
  cursor: pointer;
}
</style>
