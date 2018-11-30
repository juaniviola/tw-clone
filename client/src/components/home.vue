<template>
  <div class="home">
    <v-progress-circular
      v-if="loading"
      style="margin-top: 35px;"
      indeterminate
    >
    </v-progress-circular>

    <div class="feed">
      <tweet-card
        :tweets="tweets"
        @favTweet="favTweet"
        @delFav="delFav"
        @deleteTweet="deleteTweet"></tweet-card>
    </div>

    <v-dialog v-model="addtw" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark class="secondary">
          <v-btn icon dark @click.native="addtw = !addtw" :disabled="loading_"><v-icon>close</v-icon></v-btn>
          <v-toolbar-title>Add new tweet</v-toolbar-title>
        </v-toolbar>

        <v-flex>
          <v-textarea
            id="tw"
            :disabled="loading_"
            v-model="tweet"
            auto-grow
            box
            color="grey darken-1"
            label="What are you thinking?..."
          ></v-textarea>
        </v-flex>

        <v-progress-circular v-if="tweet.length < 280" :value="twLength"></v-progress-circular>
        <v-progress-circular v-else color="red" :value="twLength"></v-progress-circular><br>

        <div v-if="counter >= 265" style="text-align: center; color: red; font-weight: bold; margin-top: 10px;">
          <span>{{ 280 - counter }}</span>
        </div>

        <v-btn :disabled="loading_" color="darken-1" flat="flat" @click="addtw = false">Cancel</v-btn>
        <v-btn
          :disabled="loading_ || tweet.length === 0 || tweet.length >= 280"
          :loading="loading_"
          color="darken-1"
          flat="flat"
          @click="sendTweet"
        >Send</v-btn>

        <v-alert
          :value="error"
          type="error">
          An error ocurred
        </v-alert>
      </v-card>
    </v-dialog>

    <v-alert
      :value="error"
      type="error"
    >
      {{ errorMessage }}
    </v-alert>

    <v-fab-transition>
      <v-btn
        dark
        absolute
        bottom
        right
        fab
        style="right: 20px; bottom: 20px; position: fixed;"
        @click="addtw = !addtw"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>

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
import utils from '../utils/utils'
import userUtils from '../utils/userLogin'
import { mapState } from 'vuex';
import TweetCard from './tweet/tweet-card.vue'

export default {
  components: {
    TweetCard
  },

  data () {
    return {
      addtw: false,
      counter: 0,
      error_: false,
      error: false,
      errorMessage: '',
      loading: false,
      loading_: false,
      tweet: '',
      twLength: 0,
      tweets: null
    }
  },

  methods: {
    async sendTweet () {
      let tw = null

      try {
        this.loading_ = true
        tw = await utils.addTweet(this.tweet)
        this.loading_ = false
      } catch (err) {
        this.loading_ = false
        this.error_ = true
        return
      }

      if (!tw || !tw.data || !tw.data.addTweet || tw.errors) {
        this.error_ = true
        return
      }

      this.tweets.unshift(tw.data.addTweet)

      this.tweet = ''
      this.addtw = false
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

  computed: {
    ...mapState(['isLogged'])
  },

  watch : {
    tweet: function (val) {
      this.twLength = (val.length / 280) * 100
      this.counter = val.length
    },

    addtw: function (val) {
      if (!val) this.tweet = ''
      else return setTimeout(() => document.getElementById('tw').focus(), 0)
    }
  },

  async mounted () {
    if (!this.isLogged) return this.$router.push({ name: 'welcome' })

    const token = utils.getToken()

    let tw = null
    try {
      this.loading = true
      tw = await userUtils.twByFollowingUsers(token)
      this.loading = false
    } catch (err) {
      this.loading = false
      this.error = true
      this.errorMessage = 'Error ocurred loading tweets'
      return
    }

    if (!tw || !tw.data || !tw.data.tweetsByFollowingUsers || tw.errors) {
      this.error = true
      this.errorMessage = 'Error ocurred loading tweets'
      return
    }

    this.tweets = tw.data.tweetsByFollowingUsers
  }
}
</script>
