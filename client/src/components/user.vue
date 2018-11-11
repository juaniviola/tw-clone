<template>
  <div class="user">
    <v-card v-if="!loading && !error" class="elevation-5" style="margin: 20px;" >
      <v-avatar color="black">
        <v-icon dark>account_circle</v-icon>
      </v-avatar>
        <v-flex>
          <div style="word-break: break-all;">
            <span class="username text-md-center">{{ user.username }}</span> <br>
            <span class="name">{{ user.fullName }}</span>
          </div>
          <div style="margin-top: 20px;">
            <a class="follow" flat>{{ user.followers.length }} followers</a> <br>
            <a class="follow" flat>{{ user.following.length }} following</a> <br>

            <div v-if="$store.state.user.username !== user.username">
              <v-btn
                v-if="!$store.state.isLogged"
                flat color="success"
                @click="login">Login</v-btn>

              <v-btn
                v-else-if="!isFollowing"
                flat
                color="primary"
                @click="addFollow"
                :disabled="loading_"
                :loading="loading_"
              >Follow</v-btn>

              <v-btn
                v-else-if="isFollowing"
                flat
                color="error"
                @click="delFollow"
                :disabled="loading_"
                :loading="loading_"
              >Unfollow</v-btn>
            </div>

          </div>
        </v-flex>
    </v-card>

    <tweet-card
      v-if="!loading && !error"
      :tweets="tweets"
      @favTweet="favTweet"
      @delFav="delFav"
      @deleteTweet="deleteTweet"></tweet-card>

    <v-progress-circular
      v-if="loading"
      style="margin-top: 35px;"
      indeterminate
    >
    </v-progress-circular>

    <v-alert
      :value="error"
      type="error"
    >
      {{ errorMessage }}
    </v-alert>
    <v-btn
      v-show="error"
      flat
      color="info"
      @click="goHome"
    >Back home</v-btn>
  </div>
</template>

<script>
  import userUtils from '../utils/userLogin'
  import utils from '../utils/utils'
  import tweetCard from './tweet/tweet-card.vue'

  export default {
    components: { tweetCard },

    data () {
      return {
        loading_: false,
        error: false,
        errorMessage: '',
        loading: false,
        isFollowing: false,
        user: {},
        tweets: null
      }
    },

    methods: {
      login () {
        return this.$router.push({ name: 'signin' })
      },

      isFollowingFn (val) {
        if (!val || !val.username) return

        if (!this.$store.state.user || !this.$store.state.user.username) {
          return
        }

        const s = val.followers.find((user) => user.username === this.$store.state.user.username)

        if (s) {
          this.isFollowing = true
        } else {
          this.isFollowing = false
        }
      },

      async addFollow () {
        const token = utils.getToken()

        const payload = {
          token,
          userToId: this.user._id
        }

        let h = null
        try {
          this.loading_ = true
          h = await userUtils.addFollow(payload)
          this.loading_ = false
        } catch (err) {
          this.loading_ = false
          this.error = true
          this.errorMessage = 'An error ocurred :('
          return
        }

        if (!h || !h.data || !h.data.addFollow || h.errors) {
          this.error = true
          this.errorMessage = 'An error ocurred :('
          return
        }

        this.isFollowing = true
      },

      async delFollow () {
        const token = utils.getToken()

        const payload = {
          token,
          userToId: this.user._id
        }

        let h = null
        try {
          this.loading_ = true
          h = await userUtils.delFollow(payload)
          this.loading_ = false
        } catch (err) {
          this.loading_ = false
          this.error = true
          this.errorMessage = 'An error ocurred :('
          return
        }

        if (!h || !h.data || !h.data.delFollow || h.errors) {
          this.error = true
          this.errorMessage = 'An error ocurred :('
          return
        }

        this.isFollowing = false
      },

      goHome () {
        return this.$router.push({ name: 'home' })
      },

      favTweet (fav) {
        const tw = this.tweets.find(({ _id }) => _id === fav._id)
        if (!tw) return

        const find = this.tweets.indexOf(tw)
        if (find === -1) return

        return this.tweets[find].favs = fav.favs
      },

      delFav (fav) {
        const tw = this.tweets.find(({ _id }) => _id === fav._id)
        if (!tw) return

        const find = this.tweets.indexOf(tw)
        if (find === -1) return

        return this.tweets[find].favs = fav.favs
      },

      deleteTweet (twId) {
        const tw = this.tweets.find(({ _id }) => _id === twId)
        if (!tw) return

        const find = this.tweets.indexOf(tw)
        if (find === -1) return

        return this.tweets.splice(find, 1)
      }
    },

    async created () {
      const user = this.$route.params.username

      let u = null
      try {
        this.loading = true
        u = await userUtils.userProfile(user)
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        this.errorMessage = 'Error trying to load user info, or user does not exist'
        return
      }

      if (!u || !u.data || u.errors || !u.data.userByUsername || !u.data.tweetsByUsername) {
        this.error = true
        this.errorMessage = 'Error trying to load user info, or user does not exist'
        return
      }

      this.user = u.data.userByUsername
      this.tweets = u.data.tweetsByUsername
    },

    watch: {
      user (val) {
        this.isFollowingFn(val)
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
