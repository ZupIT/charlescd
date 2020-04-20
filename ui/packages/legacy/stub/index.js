const map = require('lodash/map')
const Hapi = require('hapi')
const routes = require('./routes')

function reduceDetails(acc, detail) {
  return Object.assign(acc, { [detail.index]: [detail.type] })
}

function failAction(request, reply, source, error) {
  reply({
    fields: error.data.details.reduce(reduceDetails, {}),
  }).code(400)
}

const latency = 250
const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 8000,
  routes: {
    validate: {
      failAction,
    },
    cors: {
      origin: ['*'],
      headers: ['Authorization', 'Content-Type', 'x-circle-id', 'x-application-id'],
      exposedHeaders: ['Accept'],
      additionalExposedHeaders: ['Accept'],
      maxAge: 60,
      credentials: true,
    },
  },
})

server.ext('onPreResponse', (request, reply) => {
  return new Promise(resolve => setTimeout(() => resolve(reply.continue), latency))
})

map(routes, routeModule => map(routeModule, route => server.route(route)))

const init = async () => {
  await server.start()

  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
