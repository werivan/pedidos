<template>
  <v-app id="MercadoXpress">
    <v-main>
      <headerComponent v-if="isAuthenticated" />
      <menuComponent v-if="isAuthenticated" />
      <div class="content-page">
        <Nuxt />
      </div>
      <div class="footer_wrapper">
        <footerComponent v-if="isAuthenticated" />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import headerComponent from '../components/headerComponent.vue'
import menuComponent from '../components/menuComponent.vue'
import footerComponent from '../components/footerComponent.vue'

export default {
  name: 'default-layout',
  components: {
    headerComponent,
    menuComponent,
    footerComponent
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.auth.loggedIn
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.content-page {
  overflow: auto;
}
.footer_wrapper {
  position: absolute;
  bottom: 0px;
  width: 100%;
}
</style>
