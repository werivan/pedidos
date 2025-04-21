<template>
  <div id="signin">
    <v-row no-gutters class="height-full container-signin">
      <v-col cols="12" sm="6" class="container-logo-xpr-img">
        <div class="logo-xpr-img">
          <img src="@/assets/images/logo2.png" />
        </div>
        <div class="welcome-img">
          <img src="@/assets/images/welcome.png" />
        </div>
      </v-col>
      <v-col cols="12" sm="6" class="primary container-card-login">
        <v-card class="card-login">
          <div class="title-login" color="primary">MercadoXPress</div>
          <v-form>
            <v-text-field
              class="field-custom"
              name="username"
              label="Correo"
              type="text"
              @keyup.enter="login"
              v-model="loginData.username"
            ></v-text-field>
            <v-text-field
              id="password"
              class="field-custom"
              name="password"
              label="Contraseña"
              type="password"
              @keyup.enter="login"
              v-model="loginData.password"
            ></v-text-field>
          </v-form>
          <br />
          <v-btn class="btn-primary mt-8 btn-login" @click="login" type="submit"> Login </v-btn>
          <div v-show="isErrorLogin" style="color: #f44336">Error al momento de hacer login</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import AuthServices from '~/services/AuthServices'

export default {
  name: 'signin-page',
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      isErrorLogin: false
    }
  },
  mounted() {
    if (this.$store.state.auth.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    async login() {
      try {
        this.isErrorLogin = false
        const result = await AuthServices.signin(this.$axios, this.loginData)
        result.data.refresh = false
        if (result.success) {
          this.$router.push('/orders')
          this.$store.commit('SET_USER', result)
        } else {
          this.isErrorLogin = true
        }
      } catch (err) {
        this.isErrorLogin = true
        console.log(err)
      }
    }
  }
}
</script>
<style lang="scss">
.card-login {
  margin: auto;
  max-width: 60%;
  padding: 50px;
  margin-top: 10%;
  max-height: 800px;
  border-radius: 40px !important;
}
.title-login {
  font-size: 30px;
  color: $primary-color;
  text-align: center;
  font-weight: 600;
}
.btn-login {
  width: 100%;
}
@media only screen and (max-width: 991px) {
  .card-login {
    max-width: 90%;
    padding: 30px 10px;
    margin-top: 15%;
  }
}
@media only screen and (max-width: 599px) {
  .card-login {
    max-width: 100%;
    padding: 30px 10px;
    margin: 0px 5px;
  }
  .title-login {
    font-size: 40px;
    margin: -10px;
  }
  .logo-xpr-img {
    width: 100%;
    text-align: center;
    img {
      max-height: 60px;
    }
  }
  .container-logo-xpr-img {
    margin-bottom: 5%;
    background: $white-color;
  }
  .container-signin {
    height: 100%;
  }
}
</style>
