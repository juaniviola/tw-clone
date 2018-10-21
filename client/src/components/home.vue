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

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new tweet</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex>
                <v-textarea
                  :disabled="loading"
                  v-model="tweet"
                  auto-grow
                  box
                  label="What are you thinking?..."></v-textarea>
              </v-flex>
            </v-layout>

            <v-progress-circular v-if="tweet.length < 280" :value="twLength"></v-progress-circular>
            <v-progress-circular v-else color="red" :value="twLength"></v-progress-circular>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading_" color="green darken-1" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn
            :disabled="loading_ || tweet.length === 0 || tweet.length >= 280"
            :loading="loading_"
            color="green darken-1"
            flat="flat"
            @click="sendTweet">Send</v-btn>
        </v-card-actions>
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
        @click="dialog = !dialog"
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
import TweetCard from './tweet-card.vue'

export default {
  components: {
    TweetCard
  },

  data () {
    return {
      error_: false,
      error: false,
      errorMessage: '',
      loading: false,
      loading_: false,
      dialog: false,
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
      this.dialog = false
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
    },

    dialog: function (val) {
      if (!val) this.tweet = ''
    }
  },

  async mounted () {
    if (!this.isLogged) return this.$router.push({ name: 'signin' })

    const user = utils.getUserInfo()
    if (!user || !user.user || !user.user._id) {
      this.error = true
      this.errorMessage = 'An error ocurred :('
      return
    }

    const id = user.user._id

    let tw = null
    try {
      this.loading = true
      tw = await userUtils.twByFollowingUsers(id)
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
