import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import vueMoment from 'vue-moment'

Vue.config.productionTip = false

Vue.use(vueMoment, {
  moment
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
