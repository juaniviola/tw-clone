<template>
  <div class="user">
    <v-card v-if="!loading && !error" class="elevation-5" style="margin: 20px;" >
      <v-avatar color="black">
        <v-icon dark>account_circle</v-icon>
      </v-avatar>
        <v-flex>
          <div>
            <span class="username text-md-center">{{ user.username }}</span> <br>
            <span class="name">{{ user.fullName }}</span>
          </div>
          <div style="margin-top: 20px;">
            <a class="follow" flat>{{ user.followers.length }} followers</a> <br>
            <a class="follow" flat>{{ user.following.length }} followers</a> <br>
            <v-btn
              v-if="!$store.state.isLogged"
              flat
              color="success"
              @click="login"
            >Login</v-btn>
            <v-btn v-else-if="isFollowing" flat color="primary">Follow</v-btn>
            <v-btn v-else flat color="error">Unfollow</v-btn>
          </div>
        </v-flex>
    </v-card>

    <tweet-card v-if="!loading && !error" :tweets="tweets"></tweet-card>

    <span v-if="loading">loading...</span>
  </div>
</template>

<script>
  import userUtils from '../utils/userLogin'
  import tweetCard from './tweet-card.vue'

  export default {
    components: { tweetCard },

    data () {
      return {
        error: false,
        loading: false,
        isFollowing: false,
        user: {},
        tweets: null
      }
    },

    methods: {
      login () {
        return this.$router.push('/signin')
      }
    },

    async created () {
      const user = this.$route.params.username

      this.loading = true
      const u = await userUtils.userProfile(user)
      this.loading = false

      if (!u || !u.data || u.errors) {
        this.error = true
        return
      }

      this.user = u.data.userByUsername

      // tw
      this.loading = true
      const t = await userUtils.tweetsProfile(this.user._id)
      this.loading = false

      if (!t || !t.data || t.errors) {
        this.error = true
        return
      }

      this.tweets = t.data.tweetsByUsername
    },

    mounted () {
      const token = localStorage.token
      if (!token) return

      const dec = JSON.parse(atob(token.substring(token.indexOf('.')+1, token.lastIndexOf('.'))))

      if (!this.$store.state.isLogged || !dec.user || dec.user.username) {
        this.isFollowing = false
      } else {


        this.isFollowing = true
      }
    }
  }
</script>

<style scoped>
.username {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 25px;
}

.name {
  font-size: 24px;
  color: #353535;
}

.follow {
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 24px;
}
</style>
