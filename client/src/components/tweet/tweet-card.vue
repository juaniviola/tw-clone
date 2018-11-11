<template>
  <div>
    <v-flex v-for="tweet in tweets" :key="tweet._id" style="margin-bottom: 5px;">
      <v-card>
        <v-card-title primary-title>
          <div class="headline text_good">
            <a @click="username(tweet.user.username)">{{ tweet.user.username }}</a><span class="ca"> {{ tweet.createdAt | moment('from') }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <div
            v-html="hashtagTweet(tweet.description)"
            style="text-align: left; margin-top: -15px;"
            class="tweet_desc text_good"
          ></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat icon><v-icon>comment</v-icon></v-btn>{{ tweet.answers.length }}

          <v-btn :disabled="loading" flat icon v-if="!favoriteado(tweet)" @click="setFav(tweet._id)">
            <v-icon>star_border</v-icon>{{ tweet.favs.length }}
          </v-btn>

          <v-btn :disabled="loading" flat icon v-else @click="delFav(tweet._id)">
            <v-icon color="orange">star</v-icon>{{ tweet.favs.length }}
          </v-btn>

          <v-btn flat icon @click="goToTweet(tweet)" :disabled="loading"><v-icon>keyboard_arrow_right</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="error_" width="500">
      <v-card>
        <v-card-title class="headline">Error ☹</v-card-title>
        <v-card-text>An error ocurred trying this operation.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="error_ = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import utils from '../../utils/utils'
import userUtils from '../../utils/userLogin'

export default {
  data () {
    return {
      loading: false,
      error_: false,
      answer: '',
      tweetId: ''
    }
  },

  props: ['tweets'],

  methods: {
    goToTweet (tw) {
      return this.$router.push({ name: 'tweet', params: { tweetId: tw._id } })
    },

    isOwner (userId) {
      if (!this.$store.state.user || !this.$store.state.user._id) return false

      if (this.$store.state.user._id === userId) {
        return true
      } else {
        return false
      }
    },

    favoriteado (tweet) {
      if (!this.$store.state.user || !this.$store.state.user._id) return false

      const find = tweet.favs.find(({ _id }) => _id === this.$store.state.user._id)
      if (find) {
        return true
      } else {
        return false
      }
    },

    hashtagTweet (text) {
      let repl = text.replace(/#(\w+)/g, '<a class="htg" href="/hashtag/$1">#$1</a>')
      repl = repl.replace(/@(\w+)/g, '<a class="htg" href="/user/$1">@$1</a>')
      return repl
    },

    username (username) {
      return this.$router.push({ name: 'user', params: { username } })
    },

    async deleteTweet (twId) {
      const token = utils.getToken()

      const payload = {
        token,
        tweetId: twId
      }

      let d = null
      try {
        this.loading = true
        d = await userUtils.deleteTweet(payload)
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error_ = true
      }

      if (!d || !d.data || !d.data.deleteTweet || d.errors) return this.error_ = true

      this.$emit('deleteTweet', twId)
    },

    async setFav (twId) {
      if (!this.$store.state.isLogged || !this.$store.state.user) return this.error_ = true

      const token = utils.getToken()

      const payload = {
        tweetId: twId,
        token
      }

      let f = null
      try {
        this.loading = true
        f = await userUtils.favTweet(payload)
        this.loading = false
      } catch (err) {
        this.loading = false
        return this.error_ = true
      }

      if (!f || !f.data || !f.data.favTweet || f.errors) return this.error_ = true

      this.$emit('favTweet', f.data.favTweet)
    },

    async delFav (twId) {
      if (!this.$store.state.isLogged || !this.$store.state.user) return this.error_ = true

      const token = utils.getToken()

      const payload = {
        tweetId: twId,
        token
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

      this.$emit('delFav', f.data.delFav)
    }
  }
}
</script>

<style>
.htg {
  text-decoration: none;
}

.ca {
  color: #8a8484;
  font-size: 16px;
}

.text_good {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
