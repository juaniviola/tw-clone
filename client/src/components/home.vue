<template>
  <div class="home">
    <span>You are logged</span>
  </div>
</template>

<script>
import userUtils from '../utils/userLogin'
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['isLogged'])
  },

  mounted () {
    if (!this.isLogged) return this.$router.push({ name: 'signin' })
  }
}
</script>
