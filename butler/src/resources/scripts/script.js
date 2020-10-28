/* eslint-disable */
const { Client } = require('pg')
const createMooveClient = async() => {
  try {
    const client = new Client({
      host: process.env.MOOVE_DATABASE_HOST,
      port: process.env.MOOVE_DATABASE_PORT,
      user: process.env.MOOVE_DATABASE_USER,
      password: process.env.MOOVE_DATABASE_PASSWORD,
    })
    await client.connect()
    return client
  } catch(exception) {
    console.log(exception)
  }
}

const createButlerClient = async() => {

  try {
    const client = new Client({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE
    })
    await client.connect()
    return client
  } catch(exception) {
    console.log(exception)
  }

}

const  flatten = (data) => {
  return data.reduce((a, b) => a.concat(b), [])
}

const getWorkspacesMoove = async(mooveClient) => {

  try{

    const result = await mooveClient.query('select * from workspaces')
    return result.rows.map(
      row => row.id
    )
  }catch (e) {
    console.log(e)
  }
}


const getNamespacesButler = async(workspace, client) => {
  try{
    const data = []
    const result =  await client.query('select workspace_id,PGP_SYM_DECRYPT(configuration_data::bytea, \''+process.env.ENCRYPTION_KEY+'\', \'cipher-algo=aes256\') from cd_configurations where workspace_id = \''+workspace+'\'')
    result.rows.forEach(
      row =>  data.push({
        workspace: row.workspace_id,
        namespace: JSON.parse(row.pgp_sym_decrypt).namespace
      })
    )
    return data
  }catch (e) {
    console.log(e)
  }
}
const setMigrationsExecuted = async(mooveClient) => {
  try{
    await mooveClient.query(`INSERT INTO databasechangelog values( '20200831142700-1',
    'thalles.freitas',
    'db/changelog/includes/20200831142700_alter_table_component_add_namespace.yaml',
    '2020-10-21T15:56:18.209Z',
    '151',
    'EXECUTED',
    '8:580f20ac5e756544fdd6e80c78048a56',
    'addColumn tableName=components',
        'Add namespace column to components table') `)
    await mooveClient.query(`INSERT INTO databasechangelog values(
        '20201006103400-0',
        'thalles.freitas',
        'db/changelog/includes/20201006103400_alter_table_component_snapshot_add_namespace.yaml',
          '2020-10-21T15:56:18.209Z',
          '152',
          'EXECUTED',
          '8:8ff8dd420e7a33a7c5cab68e92db5ea8',
          'addColumn tableName=component_snapshots',
          'Add namespace column to component_snapshots table')
          `)
  }catch(e){
    console.log(e)
  }
}

const updateComponentsInMoove = async(workspace, namespace, mooveClient) => {
  await mooveClient.query(`update components set namespace='${namespace}' where workspace_id ='${workspace}'`)
  await mooveClient.query(`update component_snapshots set namespace='${namespace}' where workspace_id ='${workspace}'`)
}

const createNamespaceColumnInMoove = async(mooveClient) => {
  await mooveClient.query('alter table components add column IF NOT EXISTS namespace varchar(253)')
  await mooveClient.query('alter table component_snapshots add column IF NOT EXISTS namespace varchar(253)')

}

const createMigration = async() => {
  const butlerClient = await createButlerClient()
  const mooveClient = await createMooveClient()
  const workspaces =  await getWorkspacesMoove(mooveClient)

  if (!workspaces) {
    return new Error('No workspaces found')
  }
  const data = workspaces.map(
    workspace => getNamespacesButler(workspace, butlerClient)
  )
  if(!data){
    return new Error('No namespaces found')
  }
  try{
    await createNamespaceColumnInMoove(mooveClient)
    await Promise.all(
      flatten(data).map(
        item =>  updateComponentsInMoove(item.workspace, item.namespace, mooveClient)
      ))
    await setMigrationsExecuted(mooveClient)
  } catch(exception) {
    await mooveClient.query('alter table components drop column namespace')
    return exception
  }

  await butlerClient.end()
  await mooveClient.end()
}

createMigration().then(
  success => console.log(success)
).catch(
  error => console.log(error)
)

