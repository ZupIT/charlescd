/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import PG from 'pg'
import axios from 'axios'
import qs from 'qs'
import chalk from 'chalk'
const charlesBaseUrl = process.env.CHARLES_BASEURL
const charlesUser = process.env.CHARLES_USER
const charlesPassword = process.env.CHARLES_PASSWORD
const butlerUrl = process.env.BUTLER_URL
const dbHost = process.env.DATABASE_HOST
const dbPort = process.env.DATABASE_PORT
const dbUser = process.env.DATABASE_USER
const dbPassword = process.env.DATABASE_PASSWORD
const dbName = process.env.DATABASE_NAME


const getDefaultActiveCircleDeployments = async (pgClient) => {

  try {
    console.log('Fetching default active circle deployments')
    const deployments = await pgClient.query(
      ` select d.build_id, d.circle_id,d.id,d.user_id,d.workspace_id from deployments d 
        INNER JOIN circles circles ON d.circle_id = circles.id
        WHERE d.STATUS = 'DEPLOYED' and circles.default_circle = true
    `)
    console.log(`Active default deployments: ${JSON.stringify(deployments.rows)}`)
    return deployments.rows
  } catch (error) {
    console.error(chalk.red(`Error fetching active default deployments: ${error}`))
    closePgConnection(pgClient)
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

const doDefaultCircleUndeployRequest = async (deployment) => {
  try {
    return await axios.post(
      `${butlerUrl}/v2/deployments/${deployment.id}/undeploy`,
      {},
      {
        headers: {
          'x-workspace-id': deployment.workspace_id,
        },
        timeout: 10000
      }
    )
  } catch (error) {
    console.error(chalk.red(`Error doing old version undeployment: ${error}`))
    throw error
  }
}

const defaultCircleDeployRequest = async (deployment, loginObject) => {
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
          'Authorization': `Bearer ${loginObject.data.access_token}`
        },
        timeout: 10000
      }
    )
  } catch (error) {
    console.error(chalk.red(`Error doing v2 deployment: ${error}`))
  }
}


const sleep = (milliseconds) => {
  const date = Date.now()
  let currentDate = null
  do {
    currentDate = Date.now()
  } while (currentDate - date < milliseconds)
}

const deployActualVersionDefaultDeployments = async (deployments, loginObject) => {

  for (const deployment of deployments) {
    console.log(`Deploying ${deployment.id} with V2 api`)
    await defaultCircleDeployRequest(deployment, loginObject)
    console.log('Actual version deployment requested')
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }
}

const undeployOldVersionDefaultDeployments = async (deployments, loginObject) => {
  console.log('Starting old version  default undeployments')
  for (const deployment of deployments) {
    console.log(`Undeploying ${deployment.id}`)
    await doDefaultCircleUndeployRequest(deployment)
    console.log('undeployment requested')
    console.log('Sleeping for 2 seconds')
    sleep(2000)
  }
  console.log('Done old version undeployments')

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

async function checkIfUndeployFinished(pgClient) {
  sleep(5000)
  let deployments = getDefaultActiveCircleDeployments(pgClient)
  let retry = 0
  while(deployments && deployments.length &&  retry < 10 ){
    console.log(`Retry ${retry+1}/10: Still active deployments:  Sleeping for 20 seconds: `)
    console.log(`Active deployments: ${JSON.stringify(deployments)} `)
    sleep(20000)
    retry++;
    deployments = getDefaultActiveCircleDeployments(pgClient)
  }
  if (retry === 10) {
    console.error(chalk.red(`Error undeploying: Some deployments still active ${JSON.stringify(deployments)}`))
  }
}

const doV2Migration = async () => {
  try {
    console.log(chalk.bold.green('Butler migration script: v0.4.1 to v0.4.2 \n'))
    console.log(chalk.green('This script is divided in two steps:'))
    console.log(chalk.green('1 - First, it needs to undeploy all default charles circle releases using the 0.4.1 APIs'))
    console.log(chalk.green('2 - Second, it needs to deploy the same releases using the 0.4.2 APIs\n'))


    const pgClient = await getPgConnection()
    const activeDefaultDeployments = await getDefaultActiveCircleDeployments(pgClient)
    if (!activeDefaultDeployments) {
      return
    }
    let loginObject = await doLogin()
    if (loginObject) {
      await undeployOldVersionDefaultDeployments(activeDefaultDeployments, loginObject)
      await checkIfUndeployFinished(pgClient)
      await deployActualVersionDefaultDeployments(activeDefaultDeployments, loginObject)
    }

    closePgConnection(pgClient)
    console.log(chalk.bold.green('\nMigration finished'))
  } catch(error) {
    console.error(chalk.red(`Error running migration script: ${error}`))
  }
}

(async () => {
  await doV2Migration()
})()
