const { Client } = require('pg')
const axios = require('axios');
const qs = require('qs')

const mooveUrl = process.env.MOOVE_URL
const keycloakUrl = process.env.KEYCLOAK_URL
const username = process.env.USER
const password = process.env.PASSWORD

const getDeployed = async (client) => {
  try {
    return await client.query('select * from deployments where status = \'DEPLOYED\';')
  } catch (error) {
    console.log(error.stack)
  }
}

const login = async () => {
  const payload = {
    username: username,
    password: password,
    grant_type: 'password',
    client_id: 'charlescd-client'
  }

  const config = {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 10000
  }
  try {
    return axios.post(
      `${keycloakUrl}:9090/keycloak/auth/realms/charlescd/protocol/openid-connect/token`,
      qs.stringify(payload),
      config
  )

  } catch (error) {
    console.log(error)
  }
}

const v1UndeployRequest = async (deployment) => {
  const loginResponse = await login()
  const headers = {
      headers: {
        'x-workspace-id': deployment.workspace_id,
        'Authorization': `Bearer ${loginResponse.data.access_token}`
      },
      timeout: 10000
    }
  try {
    return axios.post(`${mooveUrl}/deployments/v1/${deployment.id}/undeploy`, {}, headers)
  } catch (error) {
    console.log(err)
  }
}

const v2DeployRequest = async (deployment) => {
    const loginResponse = await login()
    const headers = {
      "x-workspace-id": deployment.workspace_id,
      'Authorization': `Bearer ${loginResponse.data.access_token}`,
      timeout: 10000
    }
    const payload = {
      authorId: 'migration-script',
      circleId: deployment.circleId,
      buildId: deployment.buildId
    }
    try {
      return axios.post(`${mooveUrl}/v2/deployments`, payload, headers)
    } catch (error) {
      console.log(error)
    }
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
})().catch(e => console.log(e.stack))


