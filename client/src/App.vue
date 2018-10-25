<template>
  <div id="app">
    <v-app>
      <v-toolbar v-show="isLogged" dark class="secondary">
        <v-toolbar-title class="white--text"><span class="bird" @click="home">🐦</span></v-toolbar-title>

        <v-spacer></v-spacer>

        <div>
          <v-btn icon @click="search = !search"><v-icon>search</v-icon></v-btn>

          <v-menu bottom origin="center center" transition="scale-transition">
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click="profile">
                <v-list-tile-title>{{ $store.state.user.username }}</v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click="logout">
                <v-list-tile-title>Salir</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </v-toolbar>

      <v-dialog v-model="search" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark class="secondary">
            <v-btn icon dark @click.native="search = !search"><v-icon>close</v-icon></v-btn>
            <v-toolbar-title>Search</v-toolbar-title>
          </v-toolbar>

          <v-flex style="margin-bottom: 35px;">
            <v-text-field
              solo
              placeholder="Search something..."
              clearable
              v-model="searchText"
            ></v-text-field>
          </v-flex>

          <v-divider></v-divider>

          <v-progress-circular
            v-if="loading"
            indeterminate>
          </v-progress-circular>

          <v-alert
            :value="error"
            type="error">
            An error ocurred
          </v-alert>

          <v-flex v-if="users && !error" v-for="user in users" :key="user._id">
            <span
              class="usernameSearch"
              @click="goToUser(user.username)"
            >{{ user.username }}</span>
            <br>
            <span class="fullNameSearch">{{ user.fullName }}</span>
            <v-divider style="margin-top: 10px;"></v-divider>
          </v-flex>
        </v-card>
      </v-dialog>

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

  data () {
    return {
      search: false,
      searchText: '',
      users: null,
      loading: false,
      error: false
    }
  },

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
      this.$router.push({ name: 'signin'})
    },

    async searchUser (user) {
      let us
      try {
        this.loading = true
        us = await userUtil.usersByUsername(user)
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        return
      }

      if (!us || !us.data || !us.data.usersByUsername || us.errors) return this.error = true

      this.users = us.data.usersByUsername
    },

    goToUser (username) {
      this.$router.push({ name: 'user', params: { username }})
      this.searchText = ''
      this.users = null
      this.search = false
    }
  },

  computed: {
    ...mapState(['isLogged', 'user'])
  },

  watch: {
    searchText (val) {
      if (val) {
        this.searchUser(val)
      }

      if (!val || val === '') this.users = null
    }
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

.usernameSearch {
  margin-top: 10px;
  font-weight: bold;
  font-size: 22px;
  cursor: pointer;
}

.fullNameSearch {
  font-size: 16px;
}
</style>
