import map from 'lodash/map';
import Hapi from 'hapi';
import routes from './routes';

const latency = 500;

function reduceDetails(acc, detail) {
  return Object.assign(acc, { [detail.index]: [detail.type] });
}

function failAction(request, reply, source, error) {
  reply({
    fields: error.data.details.reduce(reduceDetails, {})
  }).code(400);
}

const server = new Hapi.Server({
  host: '0.0.0.0',
  port: 8000,
  routes: {
    validate: {
      failAction
    },
    cors: {
      origin: ['*'],
      headers: [
        'Authorization',
        'Content-Type',
        'x-workspace-id',
        'x-circle-id'
      ],
      exposedHeaders: ['Accept'],
      additionalExposedHeaders: ['Accept'],
      maxAge: 60,
      credentials: true
    }
  }
});

server.ext('onPreResponse', (request, reply) => {
  return new Promise(resolve =>
    setTimeout(() => resolve(reply.continue), latency)
  );
});

map(routes, routeModule => map(routeModule, route => server.route(route)));

const init = async () => {
  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
