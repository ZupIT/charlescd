export const ConfigurationConstants = {

  NODE_ENV: process.env.NODE_ENV || 'dev',

  DATABASE_HOST: 'localhost',

  DATABASE_PORT: 5432,

  DATABASE_USER: 'darwin',

  DATABASE_DB_NAME: 'darwin',

  DATABASE_DB_PASS: 'darwin',

  MOOVE_URL: 'http://localhost:8883/moove',

  DARWIN_NOTIFICATION_URL: 'http://localhost:8883/deploy/notifications',

  DARWIN_UNDEPLOYMENT_CALLBACK: 'http://localhost:8883/deploy/notifications/undeployment',

  DARWIN_DEPLOYMENT_CALLBACK: 'http://localhost:8883/deploy/notifications/deployment',

  SPINNAKER_URL: 'http://localhost:8883/spinnaker',

  SPINNAKER_GITHUB_ACCOUNT: 'github-account',

  HELM_TEMPLATE_URL: 'http://localhost:8883/helm',

  HELM_PREFIX_URL: 'http://localhost:8883/helm',

  HELM_REPO_BRANCH: 'darwin-helm',

  DEFAULT_CIRCLE_ID: 'f5d23a57-5607-4306-9993-477e1598cc2a',

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

  OCTOPIPE_URL: 'http://localhost:8883/octopipe'
}

export type DefaultCircleId = 'f5d23a57-5607-4306-9993-477e1598cc2a'
