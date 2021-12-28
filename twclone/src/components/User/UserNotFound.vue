<template>
  <div class="notfound">
    <h2>Usuario no encontrado</h2>
    <p>Volver al <a href="#" @click="goToHome">inicio</a></p>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      return this.$router.push({ name: 'Welcome' });
    },
  },
};
</script>

<style lang="scss">
  .notfound {
    margin-top: -10%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-family: 'Lato', sans-serif;
  }
</style>
