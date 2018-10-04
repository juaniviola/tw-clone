import Vue from 'vue'
import Router from 'vue-router'
import Signin from '../components/signin.vue'
import Signup from '../components/signup.vue'

Vue.use(Router)

export default new Router ({
  mode: 'history',
  routes: [
    { path: '/signin', component: Signin, name: 'signin' },
    { path: '/signup', component: Signup, name: 'signup' }
  ]
})
