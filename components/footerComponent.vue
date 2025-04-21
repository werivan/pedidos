<template>
  <div id="footer">
    <v-footer>
      <div class="px-4 py-2 text-center w-100 footer-xpr">
        {{ new Date().getFullYear() }} — <strong><b>By</b> - Ivan Pacacira</strong>
      </div>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
#footer footer {
  display: flex;
  justify-content: center;
  .footer-links {
    display: flex;
    color: $grey-color;
    i {
      color: $grey-color;
      font-size: 20px !important;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
.footer-xpr {
  color: $grey-color;
}
</style>
