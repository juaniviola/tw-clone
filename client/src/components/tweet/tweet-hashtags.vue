<template>
  <div class="htg">
    <div class="hashtag">
      <span>#{{ hashtag }}</span>
    </div>

    <v-progress-circular
      v-if="loading"
      style="margin-top: 35px;"
      indeterminate
    >
    </v-progress-circular>

    <div v-if="tweets && !loading && !error" class="tweets">
      <tweet-card
        :tweets="tweets"
        @favTweet="favTweet"
        @delFav="delFav"></tweet-card>
    </div>

    <div v-if="error">
      <v-alert
        :value="error"
        type="error"
      >
        An error ocurred loading tweets
      </v-alert>

      <v-btn flat color="info" @click="$router.push({ name: 'home' })">Go home</v-btn>
    </div>

  </div>
</template>

<script>
  import userUtils from '../../utils/userLogin'
  import TweetCard from './tweet-card.vue'

  export default {
    components: { TweetCard },

    data() {
      return {
        tweets: null,
        error: false,
        loading: false,
        hashtag: ''
      }
    },

    methods: {
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
      }
    },

    async created () {
      const hashtag = this.$route.params.hashtag
      this.hashtag = hashtag
      const a = hashtag.split('')
      a.unshift('#')
      const htg = a.join('')

      let tws = null
      try {
        this.loading = true
        tws = await userUtils.tweetsByHashtag(htg)
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        return
      }

      if (!tws || !tws.data || !tws.data.tweetsByHashtags || tws.error) return this.error = true

      this.tweets = tws.data.tweetsByHashtags
    }
  }
</script>

<style scoped>
 .hashtag {
   color: rgb(50, 88, 194);
   margin-top: 30px;
   margin-bottom: 30px;
   font-size: 25px;
 }
</style>

