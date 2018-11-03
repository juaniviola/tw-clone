<template>
  <div class="signup">
    <v-container>
      <v-flex>
        <div class="title">
          <span>Welcome to 🐦!</span><br>
        </div>
        <div class="subtitle">
          <span>Create an account</span>
        </div>
      </v-flex>

      <v-flex style="margin-top: 25px; margin-bottom: 15px;">
        <v-alert :value="error" type="error">Ocurrió un error</v-alert>
      </v-flex>

      <div class="login">
        <form @submit.prevent="signup">
          <v-flex>
            <v-text-field
              placeholder="Username"
              solo
              v-model="username"
            ></v-text-field>

            <v-text-field
              placeholder="Full name"
              solo
              v-model="fullName"
            ></v-text-field>

            <v-text-field
              placeholder="email"
              solo
              type="email"
              v-model="email"
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
              dark
              type="submit"
              :disabled="loading"
              :loading="loading">Create</v-btn>
          </v-flex>
        </form>

        <v-flex>
          <div class="create">
            <router-link to="/signin" style="text-decoration: none;">Have an account? Login</router-link>
          </div>
        </v-flex>

        <v-snackbar
          v-model="snackbar"
          :timeout="6500"
          >
          User created!  😄😄
          <v-btn dark flat @click="snackbar = false"><v-icon>close</v-icon></v-btn>
        </v-snackbar>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Signup',

  data () {
    return {
      snackbar: false,
      loading: false,
      error: false,
      username: '',
      fullName: '',
      email: '',
      password: ''
    }
  },

  methods: {
    async signup () {
      const reg = /^(?=.{8,20}$)(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/

      if (this.username === '' || this.fullName === '' || this.email === '' || this.password.length < 8) return this.error = true
      if (!reg.test(this.username) || !reg.test(this.fullName)) return this.error = true

      const payload = {
        username: this.username,
        fullName: this.fullName,
        email: this.email,
        password: this.password
      }

      try {
        this.loading = true
        await this.$store.dispatch('signup', payload)
        this.loading = false
      } catch (err) {
        this.loading = false
        this.error = true
        return
      }

      this.$router.push({ name: 'signin' })
    }
  },

  computed: {
    ...mapState(['isLogged'])
  },

  mounted () {
    if (this.isLogged) return this.$router.push({ name: 'home' })
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

.subtitle {
  margin-top: 30px;
  font-size: 16px;
}
</style>
