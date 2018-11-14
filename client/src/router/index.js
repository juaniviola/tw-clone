import Vue from 'vue'
import Router from 'vue-router'
import Signin from '../components/signin/signin.vue'
import Signup from '../components/signin/signup.vue'
import Home from '../components/home.vue'
import User from '../components/user.vue'
import TweetDetail from '../components/tweet/tweet-detail.vue'
import TweetHashtag from '../components/tweet/tweet-hashtags.vue'
import Welcome from '../components/welcome.vue'
import NotFound from '../components/notFound.vue'

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
    { path: '/hashtag/:hashtag', component: TweetHashtag, name: 'hashtag' },
    { path: '*', component: NotFound }
  ]
})
