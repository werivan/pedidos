export default {
  ssr: false,
  server: {
    port: process.env.PORT, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  babel: {
    babelrc: true
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - MercadoXpress_front',
    title: 'MercadoXpress_front',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/axios'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/dotenv'
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#F46B00', // Naranja del logo
          secondary: '#D22128', // Rojo predominante de la curva
          accent: '#A5161C', // Rojo oscuro de acento
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          lightblue: '#14c6FF',
          yellow: '#FFCF00',
          pink: '#FF1976',
          orange: '#F46B00', // Coincide con primary
          magenta: '#C33AFC',
          darkblue: '#1E2D56',
          gray: '#909090',
          neutralgray: '#9BA6C1',
          green: '#2ED47A',
          red: '#FF5C4E',
          darkblueshade: '#308DC2',
          lightgray: '#D9D9D9', // Gris claro de la imagen
          lightpink: '#FFCFE3',
          white: '#FFFFFF', // Fondo principal
          black: '#000000' // Para texto y contraste fuerte
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    middleware: ['authMiddleware']
  },
  watchers: {
    webpack: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  styleResources: {
    scss: ['./assets/scss/*.scss']
  },
  env: {
    DEBUG: process.env.API_GATEWAY_URL,
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
    API_DUMMY_API: process.env.API_DUMMY_API,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    API_GATEWAY_URL: process.env.API_GATEWAY_URL,
    API_GATEWAY_ENVIROMENT: process.env.API_GATEWAY_ENVIROMENT,
    API_GATEWAY_ID: process.env.API_GATEWAY_ID
  }
}
