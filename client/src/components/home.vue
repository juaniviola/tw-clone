<template>
  <div class="home">
    <span>You are logged</span>
  </div>
</template>

<script>
import userUtils from '../utils/userLogin'

export default {
  mounted () {
    if (!userUtils.isUserLogged()) return this.$router.push({ name: 'signin' })
  }
}
</script>
