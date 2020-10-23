const { Client } = require('pg')
const axios = require('axios');
const qs = require('qs')

const mooveUrl = process.env.MOOVE_URL
const keycloakUrl = process.env.KEYCLOAK_URL

const client = new Client({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const getDeployed = async (client) => {
  try {
    return await client.query('select * from deployments where status = \'DEPLOYED\';')
  } catch (error) {
    console.log(error.stack)
  }
}

// const getDeployed = (client) => {
//   return client.query('select * from deployments where status = \'DEPLOYED\';')
//   .then(res => { return res })
//   .catch(e => console.log(e.stack))
// }

const login = () => {
  const payload = {
    username: 'charlesadmin@admin',
    password: 'charlesadmin',
    grant_type: 'password',
    client_id: 'charlescd-client'
  }

  const config = {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return axios.post(`${keycloakUrl}:9090/keycloak/auth/realms/charlescd/protocol/openid-connect/token`,
  qs.stringify(payload),
  config
  )
  .then(resp => {return resp})
  .catch(e => console.log(e))
}

const v1UndeployRequest = (deployment) => {
  return login().then(resp => {
    const headers = {
      headers: {
        'x-workspace-id': deployment.workspace_id,
        'Authorization': `Bearer ${resp.data.access_token}`
      }
    }
    return axios.post(`${mooveUrl}/deployments/v1/${deployment.id}/undeploy`, {}, headers)
    .then(resp => console.log(resp))
    .catch(err => console.log(err))
  })
}

const v2DeployRequest = (deployment) => {
    const payload = {
      authorId: 'migration-script',
      circleId: deployment.circleId,
      buildId: deployment.buildId
    }

    return http.request({
    host: mooveUrl,
    port: 8080,
    method: 'POST',
    path: '/v2/deployments',
    headers: {
      "x-workspace-id": deployment.workspace_id
    },
    body: payload
  }, (res) => {
    res.resume()
    res.on('end', () => {
      if (!res.complete)
        console.error(
          'The connection was terminated while the message was still being sent')
    })
  })
}

const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

(async () => {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })


  await client.connect()
  const result = await getDeployed(client)

  for (const deployment of result.rows) {
    console.log(`Undeploying ${deployment.id}`)
    await v1UndeployRequest(deployment)
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }

  sleep(300000)

  for (const deployment of result.rows) {
    console.log(`Deploying ${deployment.id}`)
    await v2DeployRequest(deployment)
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }
  console.log(result.rows)

  client.end()
})()


