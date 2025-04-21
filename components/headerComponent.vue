<template>
  <div id="header">
    <v-app-bar color="primary" class="navbar-custom">
      <v-app-bar-nav-icon :class="'icon-navbar'" @click="clickMenu"></v-app-bar-nav-icon>
      <div @click="toHome" class="title-navbar">MERCADO XPRESS</div>
      <v-spacer></v-spacer>
      <div class="rol-navbar mx-1" v-if="user">
        <div class="title-rol">ROL</div>
        <div class="text-rol">{{ rol }}</div>
      </div>
      <v-btn icon class="mx-1">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <div class="name-navbar mx-1" style="cursor: pointer" v-on="on">
            {{ initialLetter }}
          </div>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="logo-xpr-menu">
        <img src="@/assets/images/logo2.png" />
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'header-component',
  components: {},
  mounted() {
    this.$root.$on('closeMenu', (msg) => {
      this.drawer = msg
    })
  },
  data() {
    return {
      drawer: false
    }
  },
  computed: {
    initialLetter() {
      const name = this.$store.state.auth.user?.data?.userInfo?.name || 'N/A'
      let letters = 'N/A'
      const result = name.split(' ')
      switch (result.length) {
        case 1:
          letters = result[0].charAt(0) + result[0].charAt(1)
          break
        case 2:
          letters = result[0].charAt(0) + result[1].charAt(0)
          break
        default:
          letters = result.length > 2 ? result[0].charAt(0) + result[2].charAt(0) : 'N/A'
          break
      }
      return letters
    },
    rol() {
      return this.$store.state.auth.user?.data?.userInfo?.profile || 'N/A'
    },
    user() {
      return this.$store.state.auth.user?.data?.userInfo?.name || {}
    }
  },
  methods: {
    async logout() {
      this.$store.commit('SET_USER', { data: { refresh: false } })
      this.$router.push('/signin') // Redirigir a la página de inicio de sesión
    },
    async toHome() {
      this.$router.push('/') // Redirigir a la página principal
    },
    clickMenu() {
      console.log('click en menu')
      this.$root.$emit('openMenu', true) // Emitir evento para abrir el menú
    }
  }
}
</script>

<style lang="scss">
.title-navbar {
  color: $white-color;
  font-weight: 600;
  font-size: 25px;
  &:hover {
    cursor: pointer;
  }
}
.icon-navbar {
  i {
    color: $white-color !important;
    font-size: 30px !important;
    font-weight: 600 !important;
  }
}
.logo-xpr-menu {
  background: $white-color;
  padding: 10px 10px 0px 20px;
  position: relative;
  right: -20px;
  border-radius: 10px 0px 0px 10px;
  img {
    width: 100px;
    margin: 0px 20px;
  }
}
.name-navbar {
  border-radius: 50%;
  background: $white-color;
  height: 40px;
  width: 40px;
  text-align: center;
  padding-top: 7px;
  font-weight: 600;
  color: $grey-color;
  border: 3px solid $secondary-color;
}
.navbar-custom {
  .v-btn--icon {
    i {
      color: $white-color !important;
      font-size: 30px !important;
      font-weight: 600;
    }
  }
}
.rol-navbar {
  div {
    color: $white-color;
    font-weight: 600;
    text-align: center;
  }
  .title-rol {
    font-size: 10px;
    margin-top: 10px;
  }
  .text-rol {
    font-size: 18px;
    top: -4px;
    position: relative;
  }
}
</style>
