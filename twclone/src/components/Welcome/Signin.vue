<template>
  <div class="signin">
    <section>
      <div class="logo">
        <img src="/icons/tweeter.svg" alt="tw logo" height="30" width="126" />
      </div>

      <div class="form">
        <form action="" method="post">
          <h3>Login</h3>
          <div id="error_toast" class="disabled"><span></span></div>

          <input
            type="text"
            class="username__signin"
            name="username"
            v-model="username"
            placeholder="Username"
          />

          <input
            type="password"
            class="password__signin"
            v-model="password"
            name="password"
            placeholder="Password"
          />

          <button id="signin_btn" @click="signin">
            <div class="disabled"></div>
            <span>Sign in</span>
          </button>
        </form>
      </div>

      <div class="login">
        <span>
          Don't have an account?
          <a href="#" @click="$emit('changeScreen', 'signup')"> Sign up </a>
        </span>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import globalState from '@/utils/GlobalState';
import { setLoading, setError } from './modules/Login';

const serverUrl = config.server;
const requestPost = axios.create({
  withCredentials: true,
  baseURL: serverUrl,
});

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },

  methods: {
    clearInputs() {
      this.username = '';
      this.password = '';
    },

    setLoadingForm(isLoading) { return setLoading(isLoading); },

    setErrorToast(message) { return setError(message); },

    // eslint-disable-next-line consistent-return
    async signin(event) {
      event.preventDefault();

      const { username, password } = this;
      if (!username || !password) return this.setErrorToast('Ingresa usuario y contraseña');

      this.setLoadingForm(true);

      try {
        const userLogged = await requestPost.post(
          '/login',
          { username, password },
          { headers: { 'Content-Type': 'application/json' } },
        );

        globalState.setIsUserLogged(true);
        globalState.setUser(userLogged.data);
        this.$emit('changeScreen', 'home');
      } catch (error) {
        if (error.response?.status === 404) this.setErrorToast('Usuario o Contraseña invalidos.');
        else this.setErrorToast('Ocurrió un error.');

        this.clearInputs();
      } finally {
        this.setLoadingForm(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/login.scss";
</style>
