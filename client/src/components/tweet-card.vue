<template>
  <div>
    <v-flex v-for="tweet in tweets" :key="tweet._id" style="margin-bottom: 5px;">
      <v-card>
        <v-card-title primary-title>
          <div class="headline">
            <a>{{ tweet.user.username }}</a>
          </div>
        </v-card-title>
        <v-card-text>
          <div
            v-html="hashtagTweet(tweet.description)"
            style="text-align: left; margin-top: -15px;"
            class="tweet_desc"
          ></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat icon @click="favoriteado = !favoriteado">
            <v-icon v-if="!favoriteado">favorite_border</v-icon>
            <v-icon color="red" v-else>favorite</v-icon>
          </v-btn>{{ tweet.favs.length }}
          <v-btn flat icon color="blue"><v-icon>comment</v-icon></v-btn>{{ tweet.answers.length }}
        </v-card-actions>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
export default {
  props: ['tweets'],

  data () {
    return {
      favoriteado: false
    }
  },

  methods: {
    hashtagTweet (text) {
      let repl = text.replace(/#(\w+)/g, '<a class="htg" href="/hashtag/$1">#$1</a>')
      repl = repl.replace(/@(\w+)/g, '<a class="htg" href="/user/$1">@$1</a>')
      return repl
    }
  }
}
</script>

<style>
.htg {
  text-decoration: none;
}
</style>
