<template>
  <div id="detail">
    <v-container v-if="tweet" style="text-align: left;">
      <span style="text-align: rigth;"><a class="username">{{ tweet.user.username }}</a></span><br>
      <span class="description">{{ tweet.description }}</span><br>
      <div style="margin-bottom: 25px;"></div>
      <span> {{ tweet.createdAt | moment('from') }} </span>
    </v-container>
    <div style="text-align: right; margin-top: -10px;" v-if="tweet">
      <v-divider></v-divider>

      <v-btn flat icon v-if="isFaved()" :disabled="loading" @click="delFav"><v-icon color="orange">star</v-icon> {{ tweet.favs.length }}</v-btn>
      <v-btn flat icon v-else :disabled="loading" @click="setFav"><v-icon>star_border</v-icon> {{ tweet.favs.length }}</v-btn>

      <v-btn flat icon :disabled="loading"><v-icon>comment</v-icon> {{ tweet.answers.length }}</v-btn>
      <v-btn flat icon v-if="isOwner()" :disabled="loading"><v-icon>edit</v-icon></v-btn>
      <v-btn flat icon v-if="isOwner()" :disabled="loading" @click="deleteTweet"><v-icon>delete</v-icon></v-btn>

      <v-divider></v-divider>
    </div>
    <div v-if="tweet">
      <v-flex style="margin-bottom: 5px;" v-for="answer in tweet.answers" :key="answer._id">
        <v-card>
          <v-card-title style="font-size:16px; margin-bottom: -30px;"><a style="text-decoration: none;">{{ answer.user.username }}</a></v-card-title>
          <v-card-text style="text-align: left; margin-bottom: -10px;">{{ answer.description }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat icon @click="deleteAnswer(answer._id)"><v-icon>delete</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </div>
  </div>
</template>

<script>
  import userUtils from '../utils/userLogin'
  import utils from '../utils/utils'

  export default {
    data () {
      return {
        loading: false,
        error: false,
        tweet: null
      }
    },

    methods: {
      isFaved () {
        if (!this.$store.state.user || !this.$store.state.user._id) return false

        const find = this.tweet.favs.find(({ _id }) => _id === this.$store.state.user._id)
        if (find) {
          return true
        } else {
          return false
        }
      },

      isOwner () {
        if (!this.$store.state.user || !this.$store.state.user._id) return false

        if (this.$store.state.user._id === this.tweet.user._id) {
          return true
        } else {
          return false
        }
      },

      async setFav () {
        if (!this.$store.state.isLogged || !this.$store.state.user) return this.error = true

        const user = utils.getUserInfo()
        if (!user || !user.user || !user.user._id || !user.secure) return this.error_ = true

        const payload = {
          tweetId: this.tweet._id,
          userId: user.user._id,
          userSecure: user.secure
        }

        let f = null
        try {
          this.loading = true
          f = await userUtils.favTweet(payload)
          this.loading = false
        } catch (err) {
          this.loading = false
          return this.error = true
        }

        if (!f || !f.data || !f.data.favTweet || f.errors) return this.error = true

        this.tweet.favs = f.data.favTweet.favs
      },

      async delFav () {
        if (!this.$store.state.isLogged || !this.$store.state.user) return this.error = true

        const user = utils.getUserInfo()
        if (!user || !user.user || !user.user._id || !user.secure) return this.error = true

        const payload = {
          tweetId: this.tweet._id,
          userId: user.user._id,
          userSecure: user.secure
        }

        let f = null
        try {
          this.loading = true
          f = await userUtils.delFav(payload)
          this.loading = false
        } catch (err) {
          this.loading = false
          return this.error_ = true
        }

        if (!f || !f.data || !f.data.delFav || f.errors) return this.error_ = true

        this.tweet.favs = f.data.delFav.favs
      },

      async deleteTweet () {
        const user = utils.getUserInfo()
        if (!user || !user.user || !user.secure || !user.user._id) return this.error = true

        const conf = confirm('Are you sure?')
        if (!conf) return

        const payload = {
          userId: user.user._id,
          userSecure: user.secure,
          tweetId: this.tweet._id
        }

        let d = null
        try {
          this.loading = true
          d = await userUtils.deleteTweet(payload)
          this.loading = false
        } catch (err) {
          this.loading = false
          this.error = true
          return
        }

        if (!d || !d.data || !d.data.deleteTweet || d.errors) return this.error = true

        return this.$router.push({ name: 'home' })
      },

      async deleteAnswer (ansId) {
        const user = utils.getUserInfo()
        if (!user || !user.user || !user.secure || !user.user._id) return this.error = true

        const conf = confirm('Are you sure?')
        if (!conf) return

        const payload = {
          userId: user.user._id,
          userSecure: user.secure,
          tweetId: this.tweet._id,
          answerId: ansId
        }

        let d = null
        try {
          this.loading = true
          d = await userUtils.delAnswer(payload)
          this.loading = false
        } catch (err) {
          this.loading = false
          this.error = true
          return
        }

        if (!d || !d.data || !d.data.delAnswer || d.errors) return this.error = true

        const find = this.tweet.answers.find(({ _id }) => _id === ansId)
        if (find === -1) return

        const i = this.tweet.answers.indexOf(find)
        this.tweet.answers.splice(i, 1)
      }
    },

    async created () {
      if (!this.$route.params.tweetId) return this.error = true

      const id = this.$route.params.tweetId
      let tw = null
      try {
        this.loading = true
        tw = await userUtils.tweetById(id)
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        return
      }

      if (!tw || !tw.data || !tw.data.tweetById || tw.errors) return this.error = true

      this.tweet = tw.data.tweetById
    }
  }
</script>

<style>
.username {
  font-size: 24px;
}

.fullName {
  font-size: 20px;
  color: #655b5b;
}

.description {
  font-size: 16px;
}
</style>
