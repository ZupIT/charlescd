import qs from 'querystring'
import { KeycloakBaseApi } from './base'

const keycloakSaas = '/auth/realms/darwin/protocol/openid-connect/token'

function doLogin(username, password) {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const data = {
    grant_type: 'password',
    client_id: 'darwin-client',
    username,
    password,
  }

  return KeycloakBaseApi.request(keycloakSaas, { ...config, method: 'POST', data: qs.stringify(data) })
}

function refreshToken(refresh_token) {
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  const data = {
    grant_type: 'refresh_token',
    client_id: 'darwin-client',
    refresh_token,
  }

  return KeycloakBaseApi.request(keycloakSaas, { ...config, method: 'POST', data: qs.stringify(data) })
}

export default {
  doLogin,
  refreshToken,
}
