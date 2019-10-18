export const ConsulConstants = {

  CONSUL_PROVIDER: 'CONSUL_PROVIDER',

  CONSUL_KEY_PATH: 'config/darwin-deploy/data',

  CONSUL_DEFAULT_VALUES: {
    postgresHost: 'localhost',
    postgresPort: 5432,
    postgresUser: 'darwin',
    postgresPass: 'darwin',
    postgresDbName: 'darwin',
    mooveUrl: 'http://localhost:8883/moove',
    darwinNotificationUrl: 'http://localhost:8883/deploy',
    spinnakerUrl: 'http://localhost:8883/spinnaker'
  }
}
