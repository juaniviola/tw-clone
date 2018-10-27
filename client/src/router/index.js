import Vue from 'vue'
import Router from 'vue-router'
import Signin from '../components/signin.vue'
import Signup from '../components/signup.vue'
import Home from '../components/home.vue'
import User from '../components/user.vue'
import TweetDetail from '../components/tweet-detail.vue'
import TweetHashtag from '../components/tweet-hashtags.vue'
import Welcome from '../components/welcome.vue'

Vue.use(Router)

export default new Router ({
  mode: 'history',
  routes: [
    { path: '/welcome', component: Welcome, name: 'welcome' },
    { path: '/', component: Home, name: 'home' },
    { path: '/signin', component: Signin, name: 'signin' },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/user/:username', component: User, name: 'user' },
    { path: '/tweet/:tweetId', component: TweetDetail, name: 'tweet' },
    { path: '/hashtag/:hashtag', component: TweetHashtag, name: 'hashtag' }
  ]
})
