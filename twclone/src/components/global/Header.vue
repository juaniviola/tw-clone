<template>
  <div class="header">
    <div class="logo" @click="goToHome">
      <img src="/icons/tweeter.svg" alt="logo" height="30" width="126" />
    </div>

    <div class="search" @click="goToSearch">
      <a><img src="/icons/search.svg" alt="search"></a>
    </div>

    <div class="profile" v-show="userLogged">
      <div class="menuToggle" @click="showMenu">
        <img src="/icons/user.svg" alt="user" />
        <span>{{ username }}</span>
      </div>

      <div id="menu" class="menu hidden">
        <div class="btn" @click="goToProfile">
          <img src="/icons/user.svg" alt="profile">
          <a href="#"> My profile</a>
        </div>

        <div class="btn">
          <img src="/icons/settings.svg" alt="profile">
          <a href="#"> Settings</a>
        </div>

        <div class="line"></div>

        <div class="btn" @click="logout">
          <img src="/icons/logout.svg" alt="profile">
          <a href="#"> Logout</a>
        </div>
      </div>
    </div>

    <div v-show="!userLogged" class="notLogged">
      <a @click="goToLogin">Login</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '@/config';

const { server } = config;
const requestPost = axios.create({
  withCredentials: true,
  baseURL: server,
});

export default {
  data() {
    return {
      menuActive: false,
      selectedItem: 'home_btn',
    };
  },

  props: {
    username: String,
    userLogged: Boolean,
  },

  methods: {
    showMenu() {
      this.menuActive = !this.menuActive;
      if (this.menuActive) {
        document.getElementById('menu').className = 'menu active';
      } else {
        document.getElementById('menu').className = 'menu hidden';
      }
    },

    goToHome() {
      return this.$router.push({ name: 'Welcome' });
    },

    goToProfile() {
      return this.$router.push(`/user/${this.username}`);
    },

    goToLogin() {
      return this.$router.push({ name: 'Welcome' });
    },

    goToSearch() {
      return this.$router.push({ name: 'Search' });
    },

    async logout() {
      try {
        await requestPost.post('/logout', {});

        this.$router.go();
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/Header.scss";
</style>
