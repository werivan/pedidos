const ROUTES_WITHOUT_AUTH = ['signin', 'register']
import { encryptData, decryptData } from '../services/UtilServices' // Importamos las funciones
import AuthServices from '../services/AuthServices' // Importa la función para refrescar el token

import moment from 'moment'

export default async function (context) {
  let user = context.store.state.auth.user

  // Si el usuario no está logueado (loggedIn: false) y la ruta no está en las rutas públicas
  if (!context.store.state.auth.loggedIn) {
    const secretKey = process.env.SECRET_KEY
    let userLocalStorage = localStorage.getItem('userData')
    const routeName = context.route.path.split('/')[1]
    if (userLocalStorage) {
      userLocalStorage = decryptData(localStorage.getItem('userData'), secretKey)
      if (userLocalStorage.AccessToken && userLocalStorage.IdToken) {
        context.store.commit('SET_USER', { data: { ...userLocalStorage, refresh: false } })
      } else {
        if (!ROUTES_WITHOUT_AUTH.includes(routeName)) {
          return context.redirect('/signin')
        }
      }
    } else {
      if (!ROUTES_WITHOUT_AUTH.includes(routeName)) {
        return context.redirect('/signin')
      }
    }
  }

  //verificar si ya expiro
  if (context.store?.state?.auth?.loggedIn && user?.data?.userInfo?.exp) {
    const expirationDate = moment.unix(context.store.state.auth.user.data.userInfo.exp)
    //const expirationDate = moment().subtract(1, 'minutes').unix()
    const now = moment()
    if (now.isAfter(expirationDate)) {
      console.log('El token ha expirado. Intentando refrescar...')
      // Si el AccessToken ha expirado, intentar refrescar el token usando el refreshToken
      const RefreshToken = context.store.state.auth.user.data.RefreshToken
      const userName = context.store.state.auth.user.data.userInfo.sub
      if (RefreshToken) {
        const refreshResponse = await AuthServices.refreshToken(
          context.$axios,
          userName,
          RefreshToken
        )

        if (refreshResponse.success) {
          console.log('Token refrescado exitosamente.')
          // Actualiza los tokens en el store
          refreshResponse.data.refresh = true
          context.store.commit('SET_USER', { ...refreshResponse })
        } else {
          console.log('Error al refrescar el token.')
          return context.redirect('/signin') // Redirige a login si no se puede refrescar el token
        }
      }
    }
  }

  const routeName = context.route.path.split('/')[1]
  if (!ROUTES_WITHOUT_AUTH.includes(routeName) && !context.store.state.auth.loggedIn) {
    return context.redirect('/signin')
  }
}
