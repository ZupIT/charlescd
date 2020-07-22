import PgBoss = require('pg-boss');

const options = {
  host: 'localhost',
  database: 'darwin',
  user: 'darwin',
  password: 'darwin',
  max: 5,
  retentionDays: 7
};


const boss = new PgBoss(options);

async function start() {
  await boss.start()
  boss.on('error', (error) => console.log(error))
  await boss.publish('deployments-queue', {id: '123'})
  return await boss.publish('deployments-queue', {id: '456'})
}

async function process() {
  const boss = new PgBoss(options);
  await boss.start()
  boss.on('error', (error) => console.log(error))
  return await boss.subscribe('deployments-queue', (job) => { deploymentHandler(job) })
}

async function deploymentHandler(j: PgBoss.JobWithDoneCallback<unknown, unknown>) {
  const job = j as PgBoss.JobWithDoneCallback<{id: string}, unknown>
  console.log(job)
  if (job.data.id === '123') {
    job.done(new Error('tem gente na fila'))
    boss.publish('deployments-queue', job.data)
    return job
  }
  job.done()
  return job
}

//select * from pgboss.job where data ->>'state' = 'completed' and name =  '__state__completed__deployments-queue' and data->'request'->'data'->>'id' = '456'

// console.log(start())
// console.log(process())
async function run() {
  const boss = new PgBoss(options);
  await boss.start()
  return boss
}
run().then( b => b.fetchCompleted('deployments-queue', 20).then(d => console.log(d)))
