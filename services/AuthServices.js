import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken
} from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID
}

const userPool = new CognitoUserPool(poolData)

export default {
  async signin(_, userData) {
    return new Promise((resolve) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: userData.username,
        Password: userData.password
      })

      const user = new CognitoUser({
        Username: userData.username,
        Pool: userPool
      })

      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            success: true,
            data: {
              AccessToken: result.getAccessToken().getJwtToken(),
              IdToken: result.getIdToken().getJwtToken(),
              RefreshToken: result.getRefreshToken().getToken(),
              ExpiresIn: result.getAccessToken().getExpiration() - Math.floor(Date.now() / 1000),
              TokenType: 'Bearer'
            }
          })
        },
        onFailure: (err) => {
          console.error('Error en login:', err)
          resolve({
            success: false,
            error: err.message || 'Error desconocido'
          })
        }
      })
    })
  },

  async refreshToken(_, username, refreshToken) {
    return new Promise((resolve) => {
      const user = new CognitoUser({
        Username: username,
        Pool: userPool
      })

      const RefreshToken = new CognitoRefreshToken({
        RefreshToken: refreshToken
      })

      user.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          console.error('Error al refrescar token:', err)
          return resolve({
            success: false,
            error: err.message || 'Error desconocido'
          })
        }

        resolve({
          success: true,
          data: {
            AccessToken: session.getAccessToken().getJwtToken(),
            IdToken: session.getIdToken().getJwtToken(),
            RefreshToken: session.getRefreshToken().getToken(),
            ExpiresIn: session.getAccessToken().getExpiration() - Math.floor(Date.now() / 1000),
            TokenType: 'Bearer'
          }
        })
      })
    })
  }
}
