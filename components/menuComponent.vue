<template>
  <div id="menu">
    <v-navigation-drawer v-model="drawer" absolute bottom temporary class="menu-sec">
      <div class="title-menu">
        <div @click="goToHome()" class="text-menu">MERCADO XPRESS</div>
        <div @click="closeMenu()" class="icon-menu">
          <v-icon>mdi-arrow-left-drop-circle</v-icon>
        </div>
      </div>
      <v-list class="menu-bar" nav dense>
        <v-list-item-group v-model="selectedItem" active-class="deep-purple--text text--accent-4">
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="item.method"
            :style="validateRol(item) ? 'display: none' : ''"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'menu-component',
  data() {
    return {
      rolToken: '',
      selectedItem: 0,
      drawer: false,
      items: [
        {
          title: 'Pedidos',
          icon: 'mdi-handshake',
          visibleTo: ['admin', 'focal', 'pm'],
          method: () => this.goToOrders()
        },
        {
          title: 'Cerrar sesión',
          icon: 'mdi-exit-to-app',
          method: () => this.logout()
        }
      ]
    }
  },
  mounted() {
    this.rolToken = this.$store.state.auth.user?.data?.userInfo?.profile || 'N/A'

    // Escucha para abrir el menú
    this.$root.$on('openMenu', (msg) => {
      this.drawer = msg
    })
  },
  watch: {
    selectedItem() {
      this.drawer = false
    },
    drawer(newVal) {
      if (!newVal) {
        this.$root.$emit('closeMenu', false)
      }
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/')
      this.closeMenu()
    },
    goToOrders() {
      this.$router.push('/orders')
    },
    logout() {
      this.$store.commit('SET_USER', { data: { refresh: false } })
      this.$router.push('/signin')
    },
    closeMenu() {
      this.drawer = false
    },
    validateRol(item) {
      if (item && item.visibleTo) {
        return !item.visibleTo.includes(this.rolToken)
      }
      return false
    }
  }
}
</script>
<style lang="scss">
.title-menu {
  display: flex;
  justify-content: space-between;
  height: 125px;
  padding-top: calc(39px);
  .text-menu {
    color: $white-color;
    font-weight: 600;
    font-size: 20px;
    text-align: center;
    width: 100%;
    &:hover {
      cursor: pointer;
    }
  }
  .icon-menu {
    padding-top: 17px;
    padding-right: 5px;
    i {
      color: $white-color;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
.menu-sec .v-navigation-drawer__content {
  background: $primary-color;
}
.menu-bar {
  .v-list-item {
    .v-list-item__icon {
      margin-right: 15px;
      margin-left: 20px;
      i {
        color: $white-color !important;
      }
    }
    .v-list-item__title {
      color: $white-color !important;
      font-size: 16px;
      font-weight: 600;
      z-index: 1;
    }
    &.v-list-item--active {
      color: $secondary-color !important;
      caret-color: $secondary-color !important;
    }
    &.v-list-item--active:before {
      opacity: 0.8;
      border-radius: 50px;
    }
  }
}
</style>
