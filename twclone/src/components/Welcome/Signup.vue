<template>
  <div class="signin">
    <section>
      <div class="logo">
        <img src="/icons/tweeter.svg" alt="tw logo" height="30" width="126" />
      </div>

      <div class="form">
        <form action="" method="post">
          <h3>Create Account</h3>
          <div id="error_toast" class="disabled">
            <span></span>
          </div>
          <input
            type="text"
            v-model="username"
            name="username"
            placeholder="Username"
          />
          <input
            type="text"
            v-model="fullName"
            name="fullName"
            placeholder="Full Name"
          />
          <input type="text" v-model="email" name="email" placeholder="Email" />
          <input
            type="password"
            v-model="password"
            name="password"
            placeholder="Password"
          />
          <button id="signin_btn" @click="signup">
            <div class="disabled"></div>
            <span>Create</span>
          </button>
        </form>
      </div>

      <div class="login">
        <span
          >Have an account?
          <a href="#" @click="$emit('changeScreen', 'signin')"> Sign in </a>
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { setLoading, setError } from './modules/Login';

export default {
  data() {
    return {
      username: '',
      fullName: '',
      email: '',
      password: '',
    };
  },
  methods: {
    clearInputs() {
      this.username = '';
      this.fullName = '';
      this.email = '';
      this.password = '';
    },

    setLoadingForm(isLoading) { return setLoading(isLoading); },

    setErrorToast(message) { return setError(message); },

    // eslint-disable-next-line consistent-return
    async signup(event) {
      event.preventDefault();

      const {
        username,
        email,
        fullName,
        password,
      } = this;

      if (!email || !username || !fullName || !password) {
        return this.setErrorToast('Ingresa las credenciales');
      }

      this.setLoadingForm(true);

      try {
        const result = await this.$apollo.mutate({
          mutation: gql`
            mutation ($user: newUser!) {
              addUser(user: $user) {
                username
              }
            }
          `,

          variables: {
            user: {
              username,
              email,
              fullName,
              password,
            },
          },
        });

        if (!result?.data.addUser) throw Error('credentials');
        this.$emit('changeScreen', 'signin');
      } catch (e) {
        if (e.message.includes('credentials')) this.setErrorToast('El Usuario o Email ya existe');
        else this.setErrorToast('Ocurrió un error.');
      } finally {
        this.clearInputs();
        this.setLoadingForm(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/login.scss";
</style>
