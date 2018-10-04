<template>
  <div class="signup">
    <v-container>
      <v-flex>
        <div class="title">
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
            ></v-text-field>

            <v-text-field
              placeholder="password"
              solo
              type="password"
              v-model="password"
            ></v-text-field>
          </v-flex>

          <v-flex>
            <v-btn block color="secondary" dark type="submit">Create</v-btn>
          </v-flex>
        </form>

        <v-flex>
          <div class="create">
            <router-link to="/signin">Have an account? Login</router-link>
          </div>
        </v-flex>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Signup',

  data () {
    return {
      error: false,
      username: '',
      fullName: '',
      email: '',
      password: ''
    }
  },

  methods: {
    signup () {
      // eslint-disable-next-line
      console.log('signup')
    }
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
