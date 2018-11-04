<template>
  <div class="welcome">
    <h1 style="margin-top: 35px;">This is Twitter Clone 🐦</h1>
    <h2>Twitter clone</h2>
    <h3 style="margin-top: 35px;">Laugh and share tweets with your friends. </h3>
		<div style="margin-top: 50px;">
			<v-btn color="white" @click="$router.push({ name: 'signin' })">HAVE ACCOUNT</v-btn> <br>
			<v-btn color="white" @click="$router.push({ name: 'signup' })">I AM NEW HERE</v-btn>
		</div>

		<div class="viola">
			<span>Code with ❤️ by @juaniviola</span>
		</div>
  </div>
</template>

<style scoped>
.welcome {
	width: 100wh;
	height: 100vh;
	background-color: #424242;
	color: #fff;
}

.texto {
  font-size: 18px;
}

.viola {
	margin-top: 50px;
}
</style>

<script>
  export default {
    created () {
      if (this.$store.state.isLogged) return this.$router.push({ name: 'home' })
    }
  }
</script>
