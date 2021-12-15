<template>
  <div class="header">
    <div class="logo">
      <img src="/tweeter.svg" alt="logo" height="30" width="126" />
    </div>

    <div class="profile">
      <div class="menuToggle" @click="showMenu">
        <img src="/user.svg" alt="asd" />
        <span>{{ username }}</span>
      </div>

      <div id="menu" class="menu hidden">
        <div class="btn">
          <img src="/user.svg" alt="profile">
          <a href="#"> My profile</a>
        </div>

        <div class="btn">
          <img src="/settings.svg" alt="profile">
          <a href="#"> Settings</a>
        </div>

        <div class="line"></div>

        <div class="btn">
          <img src="/logout.svg" alt="profile">
          <a href="#"> Logout</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuActive: false,
      selectedItem: 'home_btn',
    };
  },

  props: {
    username: String,
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
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/Header.scss";
</style>
