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

    <tweet-card v-if="!loading && !error" :tweets="tweets"></tweet-card>

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
  </div>
</template>

<script>
  import userUtils from '../utils/userLogin'
  import utils from '../utils/utils'
  import tweetCard from './tweet-card.vue'

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
        if (!this.$store.state.user || !this.$store.state.user.username) return

        const s = val.followers.find((user) => user.username === this.$store.state.user.username)

        if (s) {
          this.isFollowing = true
        } else {
          this.isFollowing = false
        }
      },

      async addFollow () {
        const user = utils.getUserInfo()

        const payload = {
          userFromId: user.user._id,
          userFromSecure: user.secure,
          userToId: this.user._id
        }

        this.loading_ = true
        const h = await userUtils.addFollow(payload)
        this.loading_ = false

        this.isFollowing = true
      },

      async delFollow () {
        const user = utils.getUserInfo()

        const payload = {
          userFromId: user.user._id,
          userFromSecure: user.secure,
          userToId: this.user._id
        }

        this.loading_ = true
        const h = await userUtils.delFollow(payload)
        this.loading_ = false

        this.isFollowing = false
      }
    },

    async created () {
      const user = this.$route.params.username

      this.loading = true
      const u = await userUtils.userProfile(user)
      this.loading = false

      if (!u || !u.data || u.errors || !u.data.userByUsername) {
        this.error = true
        this.errorMessage = 'User does not exist'
        return
      }

      this.user = u.data.userByUsername

      // tw
      this.loading = true
      const t = await userUtils.tweetsProfile(this.user._id)
      this.loading = false

      if (!t || !t.data || t.errors) {
        this.error = true
        this.errorMessage = 'Error trying load tweets'
        return
      }

      this.tweets = t.data.tweetsByUsername
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
