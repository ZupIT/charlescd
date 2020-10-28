import PG from 'pg'
import axios from 'axios'
import qs from 'qs'

const mooveUrl = process.env.MOOVE_URL
const keycloakUrl = process.env.KEYCLOAK_URL
const charlesUser = process.env.USER
const charlesPassword = process.env.PASSWORD
const dbHost = process.env.DATABASE_HOST
const dbUser = process.env.DATABASE_USER
const dbPassword = process.env.DATABASE_PASSWORD
const dbName = process.env.DATABASE_NAME

const getActiveDeployments = async (client) => {
  try {
    console.log('Fetching active deployments')
    const deployments = await client.query('select * from deployments where status = \'DEPLOYED\';')
    console.log(`Active deployments: ${deployments.rows}`)
    return deployments.rows
  } catch (error) {
    console.error(`Error fetching active deployments: ${error}`)
  }
}

const doLogin = async () => {
  try {
    console.log('Starting authentication')
    const loginObject = axios.post(
      `${keycloakUrl}:9090/keycloak/auth/realms/charlescd/protocol/openid-connect/token`,
      qs.stringify({
        username: charlesUser,
        password: charlesPassword,
        grant_type: 'password',
        client_id: 'charlescd-client'
      }),
      {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    )
    console.log('Done authentication')
    return loginObject
  } catch (error) {
    console.error(`Error authenticating: ${error}`)
  }
}

const doV1UndeployRequest = async (deployment, loginObject) => {
  try {
    console.log(`Undeploying ${deployment.id} with V1 api`)
    const v1UndeployResponse = axios.post(
      `${mooveUrl}/deployments/v1/${deployment.id}/undeploy`,
      {},
      {
        headers: {
          'x-workspace-id': deployment.workspace_id,
          'Authorization': `Bearer ${loginObject.data.access_token}`
        },
        timeout: 10000
      }
    )
    console.log('V1 undeployment requested')
    return v1UndeployResponse
  } catch (error) {
    console.error(`Error doing v1 undeployment: ${error}`)
  }
}

const v2DeployRequest = async (deployment, loginObject) => {
  try {
    console.log(`Deploying ${deployment.id} with V2 api`)
    const v2DeploymentResponse = axios.post(
      `${mooveUrl}/v2/deployments`,
      {
        authorId: 'migration-script',
        circleId: deployment.circleId,
        buildId: deployment.buildId
      },
      {
        'x-workspace-id': deployment.workspace_id,
        'Authorization': `Bearer ${loginObject.data.access_token}`,
        timeout: 10000
      }
    )
    console.log('V2 deployment requested')
    return v2DeploymentResponse
  } catch (error) {
    console.error(`Error doing v2 deployment: ${error}`)
  }
}

const sleep = (milliseconds) => {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}

const deployV2Deployments = async (deployments, loginObject) => {
  for (const deployment of deployments) {
    console.log(`Deploying ${deployment.id}`)
    await v2DeployRequest(deployment, loginObject)
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }
}

const undeployV1Deployments = async (deployments, loginObject) => {
  console.log('Starting v1 undeployments')
  for (const deployment of deployments) {
    await doV1UndeployRequest(deployment, loginObject)
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }
  console.log('Done v1 undeployments')
}

const closePgConnection = (pgClient) => {
  pgClient.end()
}

const getPgConnection = async () => {
  console.log('Creating postgresql client connection')
  const client = new PG.Client({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
  await client.connect()
  console.log('Done creating pg connection')
  return client
}

const doV2Migration = async () => {
  try {
    console.log('Starting migration script')
    const pgClient = await getPgConnection()
    const activeDeployments = await getActiveDeployments(pgClient)
    const loginObject = await doLogin()
    await undeployV1Deployments(activeDeployments, loginObject)
    sleep(300000)
    await deployV2Deployments(activeDeployments, loginObject)
    closePgConnection(pgClient)
    console.log('Migration finished with no errors')
  } catch(error) {
    console.error(`Error running migration script: ${error}`)
  }
}

(async () => {
  await doV2Migration()
})()
