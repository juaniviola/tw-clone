import Vue from 'vue'
import Vuex from 'vuex'
import userUtils from './utils/userLogin'
import utils from './utils/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    isLogged: false,
    user: {}
  },

  mutations: {
    setLogged (state, value) {
      state.isLogged = value
    },

    setUser (state, payload) {
      return Object.assign(state.user, payload)
    },

    unsetUser (state) {
      delete state.user._id
      delete state.user.fullName
      delete state.user.username
    }
  },

  actions: {
    async login (context, payload) {
      const u = await userUtils.login(payload)

      if (!u || !u.data || u.errors) return 'error'
      const token = u.data.login
      localStorage.setItem('token', token)

      const user = utils.getUserInfo()
      if (!user || !user.user) return

      context.commit('setLogged', true)
      context.commit('setUser', user.user)

      return u
    },

    logout (context) {
      context.commit('setLogged', false)
      context.commit('unsetUser')
      localStorage.clear()
      return
    },

    async signup (context, payload) {
      const result = await userUtils.signup(payload)
      if (!result.data.addUser || !result.data.addUser._id || Array.isArray(result.errors)) return 'error'
      return
    }
  }
})

export default store
