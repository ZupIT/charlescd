import axios from 'axios'
import qs from 'querystring'

const createRequestBody = (username: string, password: string) => ({
  grant_type: 'password',
  client_id: 'charlescd-client',
  username,
  password
})

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export const getToken = async (username: string, password: string, keycloak: string):Promise<string> => {
  try {
    const token = await axios.post(
      `${keycloak}/realms/charlescd/protocol/openid-connect/token`,
      qs.stringify(createRequestBody(username, password)),
      config
    )
    return token.data.access_token
  } catch (error) {
    return error
  }
}
