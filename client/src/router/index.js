import Vue from 'vue'
import Router from 'vue-router'
import Signin from '../components/signin.vue'

Vue.use(Router)

export default new Router ({
  routes: [
    { path: '/', component: Signin, name: 'signin' }
  ]
})
