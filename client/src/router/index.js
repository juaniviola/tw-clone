import Vue from 'vue'
import Router from 'vue-router'
import Signin from '../components/signin.vue'
import Signup from '../components/signup.vue'
import Home from '../components/home.vue'
import User from '../components/user.vue'

Vue.use(Router)

export default new Router ({
  mode: 'history',
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/signin', component: Signin, name: 'signin' },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/user/:username', component: User, name: 'user' }
  ]
})
