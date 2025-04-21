export default function (context) {
  // 👉 Interceptor para agregar el token en cada request
  context.$axios.interceptors.request.use(function (config) {
    const IdToken = context.store.state.auth.user.data.IdToken
    console.log('IdToken')
    console.log(IdToken)
    if (IdToken) {
      config.headers.common['Authorization'] = IdToken
      config.headers.common['Content-Type'] = 'application/json'
    }
    return config
  })

  // 👉 Interceptor para manejar errores, especialmente 401
  context.$axios.interceptors.response.use(
    (response) => {
      return response
    },
    async function (error) {
      const originalRequest = error.config

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest.url.includes('/api/auth/signin')
      ) {
        try {
          // Intentamos refrescar el Token
          let result
          try {
            // Si tienes un helper $_refreshToken inyectado, lo usas
            result = await AuthServices.refreshToken(
              context.$axios,
              context.store.state.auth.user.data.userInfo.sub,
              context.store.state.auth.user.data.RefreshToken
            )
            if (result.success) {
              console.log('Token refrescado exitosamente.')
              // Actualiza los tokens en el store
              result.data.refresh = true
              context.store.commit('SET_USER', { ...result })
              originalRequest.headers['Authorization'] = result.data.IdToken
              return context.$axios(originalRequest)
            } else {
              console.log('Error al refrescar el token.')
              return context.redirect('/signin') // Redirige a login si no se puede refrescar el token
            }
          } catch (e) {
            // Falló el refresh: limpiamos sesión
            context.store.commit('SET_USER', {})
            context.redirect('/signin')
            return Promise.reject(error)
          }
        } catch (err) {
          console.error('Error en el interceptor 401:', err)
          return Promise.reject(error)
        }
      } else {
        return Promise.reject(error)
      }
    }
  )
}
