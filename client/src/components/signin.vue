<template>
  <div class="signin">
    <v-container>
      <v-flex>
        <div class="title">
          <span>Login with your account</span>
        </div>
      </v-flex>

      <v-flex style="margin-top: 25px; margin-bottom: 15px;">
        <v-alert :value="error" type="error">Ocurrió un error</v-alert>
      </v-flex>

      <div class="login">
        <form @submit.prevent="signin">
          <v-flex>
            <v-text-field
              placeholder="Username"
              solo
              v-model="username"
              :disabled="loading"
            ></v-text-field>

            <v-text-field
              placeholder="password"
              solo
              type="password"
              v-model="password"
              :disabled="loading"
            ></v-text-field>
          </v-flex>

          <v-flex>
            <v-btn
              block
              color="secondary"
              type="submit"
              :loading="loading"
              :disabled="loading"
              >Login</v-btn>
          </v-flex>
        </form>

        <v-flex>
          <div class="create">
            <router-link to="/signup">Create an account. It's free</router-link>
          </div>
        </v-flex>
      </div>
    </v-container>
  </div>
</template>

<script>
import userUtils from '../utils/userLogin'

export default {
  name: 'Signin',

  data () {
    return {
      loading: false,
      error: false,
      username: '',
      password: ''
    }
  },

  methods: {
    async signin () {
      if (this.username === '' || this.password === '') return this.error = true

      const payload = {
        username: this.username,
        password: this.password
      }

      this.loading = true
      const u = await userUtils.login(payload)
      this.loading = false

      if (!u || !u.data || u.errors) return this.error = true

      const token = u.data.login
      localStorage.setItem('token', token)
      this.$router.push({ name: 'home' })
    }
  },

  mounted () {
    if (userUtils.isUserLogged()) return this.$router.push({ name: 'home' })
  }
}
</script>

<style scoped>
.create {
  margin-top: 15px;
}

.title {
  margin-top: 15px;
}
</style>
