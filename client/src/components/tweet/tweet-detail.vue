<template>
  <div id="detail">
    <v-progress-circular
      v-if="loading  && !tweet"
      style="margin-top: 35px;"
      indeterminate
    >
    </v-progress-circular>

    <div v-if="!tweet && !loading">
      <v-alert
        value="true"
        type="error"
      >
        The tweet does not exist
      </v-alert>

      <v-btn
        flat
        color="info"
        @click="$router.push('/')"
      >Back home</v-btn>
    </div>

    <v-container v-if="tweet" style="text-align: left;" class="wb">
      <span style="text-align: rigth;"><a class="username" @click="goToUser()">{{ tweet.user.username }}</a></span><br>
      <span v-html="hashtagTweet()" class="description"></span><br>
      <div style="margin-bottom: 25px;"></div>
      <span> {{ tweet.createdAt | moment('from') }} </span>
    </v-container>
    <div style="text-align: right; margin-top: -10px;" v-if="tweet">
      <v-divider></v-divider>

      <v-btn flat icon :disabled="loading"><v-icon>comment</v-icon> {{ tweet.answers.length }}</v-btn>

      <v-btn flat icon v-if="isFaved()" :disabled="loading" @click="delFav"><v-icon color="orange">star</v-icon> {{ tweet.favs.length }}</v-btn>
      <v-btn flat icon v-else :disabled="loading" @click="setFav"><v-icon>star_border</v-icon> {{ tweet.favs.length }}</v-btn>

      <v-btn flat icon v-if="isOwner()" :disabled="loading" @click="editDialog"><v-icon>edit</v-icon></v-btn>
      <v-btn flat icon v-if="isOwner()" :disabled="loading" @click="deleteTweet"><v-icon>delete</v-icon></v-btn>

      <v-divider></v-divider>
    </div>
    <div v-if="tweet" style="margin-bottom: 80px;" class="wb">
      <v-flex v-for="answer in tweet.answers" :key="answer._id">
        <v-card>
          <v-card-title style="font-size:16px; margin-bottom: -30px;"><a style="text-decoration: none;" @click="goToUser(answer.user.username)">{{ answer.user.username }}</a></v-card-title>
          <v-card-text style="text-align: left; margin-bottom: -10px;" v-html="hashtagTweet(answer.description)"></v-card-text>
          <div style="text-align: left; margin-left: 15px; color: #717171;">
            <span> {{ answer.createdAt | moment('from') }} </span>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="isOwner_(answer.user._id)" flat icon @click="deleteAnswer(answer._id)"><v-icon>delete</v-icon></v-btn>
          </v-card-actions>
        </v-card>
        <v-divider></v-divider>
      </v-flex>
    </div>

    <v-flex v-if="tweet">
      <v-text-field
        :append-icon="loading_ ? 'sync' : 'send'"
        solo
        block
        dark
        v-model="answer"
        placeholder="Enter a comment"
        style="position: fixed; bottom: -30px; width: 100%;"
        @click:append="addComment"
        @keypress.enter="addComment"
        :loading="loading_"
        :disabled="loading_"
      ></v-text-field>
    </v-flex>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-text>
          <v-layout wrap>
            <v-flex>
              <v-textarea
                id="edit"
                :disabled="loading2"
                v-model="newTweet"
                auto-grow
                color="grey darken-1"
                ref="upTw"
                box></v-textarea>
            </v-flex>
          </v-layout>

          <v-progress-circular v-if="newTweet.length <= 280" :value="twLength"></v-progress-circular>
          <v-progress-circular v-else color="red" :value="twLength"></v-progress-circular>

          <div v-if="counter >= 265" style="text-align: center; color: red; font-weight: bold; margin-top: 10px;">
            <span>{{ 280 - counter }}</span>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading2" color="darken-1" flat="flat" @click="dialog = false">Cancel</v-btn>
          <v-btn
            :disabled="loading2 || newTweet.length === 0 || newTweet.length > 280"
            :loading="loading2"
            color="darken-1"
            flat="flat"
            @click="updateTweet">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="error" width="500">
      <v-card>
        <v-card-title class="headline">Error ☹</v-card-title>
        <v-card-text>An error ocurred trying this operation.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="error = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import userUtils from '../../utils/userLogin'
  import utils from '../../utils/utils'

  export default {
    data () {
      return {
        loading: false,
        loading_: false,
        loading2: false,
        error: false,
        tweet: null,
        answer: '',
        dialog: false,
        twLength: 0,
        counter: 0,
        newTweet: ''
      }
    },

    methods: {
      hashtagTweet (desc = null) {
        let text = ''

        if (!desc) {
          text = this.tweet.description
        } else {
          text = desc
        }

        let repl = text.replace(/#(\w+)/g, '<a class="htg" href="/hashtag/$1">#$1</a>')
        repl = repl.replace(/@(\w+)/g, '<a class="htg" href="/user/$1">@$1</a>')
        return repl
      },

      goToUser (us = null) {
        let user = ''

        if (!us) {
          user = this.tweet.user.username
        } else {
          user = us
        }

        return this.$router.push({ name: 'user', params: { username: user } })
      },

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

      isOwner_ (id) {
        if (!this.$store.state.user || !this.$store.state.user._id) return false

        if (this.$store.state.user._id === id) {
          return true
        } else {
          return false
        }
      },

      async setFav () {
        if (!this.$store.state.isLogged || !this.$store.state.user) return this.error = true

        const token = utils.getToken()

        const payload = {
          tweetId: this.tweet._id,
          token
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

        const token = utils.getToken()

        const payload = {
          tweetId: this.tweet._id,
          token
        }

        let f = null
        try {
          this.loading = true
          f = await userUtils.delFav(payload)
          this.loading = false
        } catch (err) {
          this.loading = false
          return this.error = true
        }

        if (!f || !f.data || !f.data.delFav || f.errors) return this.error_ = true

        this.tweet.favs = f.data.delFav.favs
      },

      async deleteTweet () {
        const token = utils.getToken()

        const conf = confirm('Are you sure?')
        if (!conf) return

        const payload = {
          token,
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
        const token = utils.getToken()

        const conf = confirm('Are you sure?')
        if (!conf) return

        const payload = {
          token,
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
      },

      async addComment () {
        if (this.answer.length === 0 || this.answer.length > 140) return

        if (!this.$store.state.isLogged || !this.$store.state.user) return this.error = true

        const token = utils.getToken()

        const payload = {
          tweetId: this.tweet._id,
          token,
          description: this.answer
        }

        let a = null
        try {
          this.loading_ = true
          a = await userUtils.addAnswer(payload)
          this.loading_ = false
        } catch (err) {
          this.answer = ''
          this.loading_ = false
          this.error = true
          return
        }

        if (!a || !a.data || !a.data.addAnswer || a.errors) {
          this.answer = ''
          this.error = true
          return
        }

        this.answer = ''

        this.tweet.answers = a.data.addAnswer.answers
      },

      editDialog () {
        this.newTweet = this.tweet.description
        this.dialog = true
        setTimeout (() => document.getElementById('edit').focus(), 0)
      },

      async updateTweet () {
        if (this.newTweet === '') return

        if (!this.$store.state.isLogged || !this.$store.state.user) return this.error = true

        const token = utils.getToken()

        const tw = {
          _id: this.tweet._id,
          description: this.newTweet,
          token
        }

        let e = null
        try {
          this.loading2 = true
          e = await userUtils.editTweet(tw)
          this.loading2 = false
        } catch (err) {
          this.loading2 = false
          this.newTweet = ''
          this.dialog = false
          this.error = true
          return
        }

        this.newTweet = ''
        this.dialog = false

        if (!e || !e.data || !e.data.editTweet || e.errors) {
          this.newTweet = ''
          this.dialog = false
          this.error = true
          return
        }

        this.tweet.description = e.data.editTweet.description
      }
    },

    watch: {
      newTweet (val) {
        this.twLength = (val.length / 280) * 100
        this.counter = val.length
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

.wb {
  word-break: break-all;
}
</style>
