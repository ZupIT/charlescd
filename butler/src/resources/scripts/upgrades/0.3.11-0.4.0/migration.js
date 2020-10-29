import PG from 'pg'
import axios from 'axios'
import qs from 'qs'
import chalk from 'chalk'
import prompt from 'prompt-sync'

const charlesBaseUrl = process.env.CHARLES_BASEURL
const charlesUser = process.env.CHARLES_USER
const charlesPassword = process.env.CHARLES_PASSWORD
const dbHost = process.env.DATABASE_HOST
const dbPort = process.env.DATABASE_PORT
const dbUser = process.env.DATABASE_USER
const dbPassword = process.env.DATABASE_PASSWORD
const dbName = process.env.DATABASE_NAME

const syncPrompt = prompt({})

const getActiveDeployments = async (pgClient) => {
  try {
    console.log('Fetching active deployments')
    const deployments = await pgClient.query('select * from deployments where status = \'DEPLOYED\';')
    console.log(`Active deployments: ${JSON.stringify(deployments.rows)}`)
    return deployments.rows
  } catch (error) {
    console.error(chalk.red(`Error fetching active deployments: ${error}`))
  }
}

const doLogin = async () => {
  try {
    console.log('Starting authentication')
    const loginObject = await axios.post(
      `${charlesBaseUrl}/keycloak/auth/realms/charlescd/protocol/openid-connect/token`,
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
    console.error(chalk.red(`Error authenticating: ${error}`))
  }
}

const doV1UndeployRequest = async (deployment, loginObject) => {
  try {
    return await axios.post(
      `${charlesBaseUrl}/moove/deployments/v1/${deployment.id}/undeploy`,
      {},
      {
        headers: {
          'x-workspace-id': deployment.workspace_id,
          'Authorization': `Bearer ${loginObject.data.access_token}`
        },
        timeout: 10000
      }
    )
  } catch (error) {
    console.error(chalk.red(`Error doing v1 undeployment: ${error}`))
  }
}

const v2DeployRequest = async (deployment, loginObject) => {
  try {
    return await axios.post(
      `${charlesBaseUrl}/moove/v2/deployments`,
      {
        authorId: deployment.user_id,
        circleId: deployment.circle_id,
        buildId: deployment.build_id
      },
      {
        headers: {
          'x-workspace-id': deployment.workspace_id,
          'Authorization': `Bearer ${loginObject.data.access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )
  } catch (error) {
    console.error(chalk.red(`Error doing v2 deployment: ${error}`))
  }
}

const checkForDefaultCircle = async (circleId, pgClient) => {
  try {
    const queryResult = await pgClient.query(`select * from circles where id = '${circleId}' and default_circle = true;`)
    return queryResult.rows.length > 0
  } catch(error) {
    console.error(chalk.read(`Error checking if the deployment circle ${circleId} is default`))
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
    console.log(`Deploying ${deployment.id} with V2 api`)
    await v2DeployRequest(deployment, loginObject)
    console.log('V2 deployment requested')
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }
}

const undeployV1Deployments = async (deployments, loginObject, pgClient) => {
  console.log('Starting v1 undeployments')
  for (const deployment of deployments) {
    const isDefaultCircle = await checkForDefaultCircle(deployment.circle_id, pgClient)
    if (!isDefaultCircle) {
      console.log(`Undeploying ${deployment.id} with V1 api`)
      await doV1UndeployRequest(deployment, loginObject)
      console.log('V1 undeployment requested')
      console.log('Sleeping for 2 seconds')
      sleep(2000)
    } else {
      console.log(`Not undeploying default circle deployment ${deployment.id}`)
    }
  }
  console.log('Done v1 undeployments')
}

const closePgConnection = (pgClient) => {
  console.log('Closing db connection')
  pgClient.end()
  console.log('Finished closing db connection')
}

const getPgConnection = async () => {
  console.log('Creating postgresql client connection')
  const client = new PG.Client({
    host: dbHost,
    port: dbPort,
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
    console.log(chalk.bold.green('Butler migration script: v0.3.11 to v0.4.0\n'))
    console.log(chalk.green('This script is divided in two steps:'))
    console.log(chalk.green('1 - First, it needs to undeploy all charles releases using the 0.3.11 APIs'))
    console.log(chalk.green('2 - Second, it needs to deploy the same releases using the 0.4.0 APIs\n'))
    console.log(chalk.bold.red('Disclaimer: After the end of the script, there might be some stale resources in your cluster. Please remove them manually.\n'))

    const pgClient = await getPgConnection()
    const activeDeployments = await getActiveDeployments(pgClient)
    let loginObject = await doLogin()
    await undeployV1Deployments(activeDeployments, loginObject, pgClient)

    console.log(chalk.bold.red('\nPlease check if all your undeployments finished before proceeding to the next step.\n'))
    let deployDecision = 'no'
    do {
      deployDecision = syncPrompt(chalk.bold('Start 0.4.0 deployments? (yes/no): '), 'no')
    } while(deployDecision !== 'yes')
    await deployV2Deployments(activeDeployments, loginObject)

    closePgConnection(pgClient)
    console.log(chalk.bold.green('\nMigration finished'))
  } catch(error) {
    console.error(chalk.red(`Error running migration script: ${error}`))
  }
}

(async () => {
  await doV2Migration()
})()
