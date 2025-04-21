import jwt_decode from 'jwt-decode'
import { encryptData, decryptData } from '../services/UtilServices'

export const state = () => ({
  auth: {
    user: {},
    loggedIn: false,
    userData: null
  }
})

export const mutations = {
  SET_USER(state, user) {
    try {
      const accessToken = user?.data?.AccessToken
      const idToken = user?.data?.IdToken
      const refreshToken = user.data.refresh
        ? state.auth.user?.data?.RefreshToken
        : user?.data?.RefreshToken

      // Nota: Cognito no siempre devuelve ExpiresIn ni TokenType, por eso los dejamos opcionales
      const expiresIn = user.data.refresh
        ? state.auth.user?.data?.ExpiresIn
        : user?.data?.ExpiresIn || null

      const tokenType = user.data.refresh
        ? state.auth.user?.data?.TokenType
        : user?.data?.TokenType || 'Bearer'

      if (accessToken && idToken) {
        // Decodificar el ID Token para obtener userInfo (como email, sub, etc.)
        const decodedToken = jwt_decode(idToken)

        const userData = {
          AccessToken: accessToken,
          IdToken: idToken,
          RefreshToken: refreshToken,
          ExpiresIn: expiresIn,
          TokenType: tokenType,
          userInfo: decodedToken
        }

        // Encriptar y guardar
        const secretKey = process.env.SECRET_KEY
        const encryptedData = encryptData(userData, secretKey)
        localStorage.setItem('userData', encryptedData)

        // Estado en Vuex
        state.auth.loggedIn = true
        state.auth.user.data = userData
      } else {
        state.auth.loggedIn = false
        state.auth.user.data = null
        localStorage.removeItem('userData')
      }
    } catch (e) {
      console.error('Error en SET_USER:', e)
      state.auth.loggedIn = false
      state.auth.user.data = null
      localStorage.removeItem('userData')
    }
  }
}
