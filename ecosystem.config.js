module.exports = {
    apps: [
        {
            name: "MercadoXpress",
            script: "nuxt start",
            watch: false,
            exec_mode : "fork",
            env: {
                PORT: 8089
            },
            env_production: {
                PORT: 1805
            }
        }]
  }
