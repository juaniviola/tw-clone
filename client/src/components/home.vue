<template>
  <div class="home">
    <div class="feed">
      <v-container fluid grid-list-lg>
        <tweet-card :tweets="tweets"></tweet-card>
      </v-container>
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
          <v-btn :disabled="loading" color="green darken-1" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn
            :disabled="loading || tweet.length === 0 || tweet.length > 280"
            :loading="loading"
            color="green darken-1"
            flat="flat"
            @click="sendTweet">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-fab-transition>
      <v-btn
        color="green"
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
  </div>
</template>

<script>
import userUtils from '../utils/userLogin'
import utils from '../utils/utils'
import { mapState } from 'vuex';
import TweetCard from './tweet-card.vue'

export default {
  components: {
    TweetCard
  },

  data () {
    return {
      loading: false,
      dialog: false,
      tweet: '',
      twLength: 0,
      tweets: null
    }
  },

  methods: {
    async sendTweet () {
      this.loading = true
      const tw = await utils.addTweet(this.tweet)
      this.loading = false

      if (!tw.data || tw.errors) return console.log('error')

      this.tweet = ''
      this.dialog = false
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

  mounted () {
    if (!this.isLogged) return this.$router.push({ name: 'signin' })

    // TODO: get tweets
    this.tweets = [
      {
        _id: 'asd123',
        user: {username: 'elPepo'},
        description: 'Hola este es un texto de prueba para saber como se ve.',
        favs: [{username: 'juan'}, {username: 'pipo'}],
        answers: []
      },
      {
        _id: '123asd',
        user: {username: 'juaniviola'},
        description: 'Hola como andas, espero que bien... !!! @viola #goodMorning',
        favs: [{username: 'juan'}],
        answers: [{username: 'papa'}]
      },
      {
        _id: '1as23',
        user: {username: 'quierounpaty'},
        description: 'Esta tarde me siento genial #GreatDay',
        favs: [],
        answers: [{us: 'a'}, {us: 'b'}, {us: 'c'}]
      }
    ]
  }
}
</script>
