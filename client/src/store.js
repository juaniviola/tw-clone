import Vue from 'vue'
import Vuex from 'vuex'
import userUtils from './utils/userLogin'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
    isLogged: false,
    user: null
  },

  mutations: {
    setLogged (state, value) {
      state.isLogged = value
    }
  },

  actions: {
    async login (context, payload) {
      const u = await userUtils.login(payload)

      if (!u || !u.data || u.errors) return 'error'
      const token = u.data.login
      localStorage.setItem('token', token)

      context.commit('setLogged', true)

      return u
    },

    logout (context) {
      context.commit('setLogged', false)
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
