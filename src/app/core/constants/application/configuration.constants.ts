export const ConfigurationConstants = {

  NODE_ENV: process.env.NODE_ENV || 'dev',

  DATABASE_HOST: 'http://localhost:5432',

  DATABASE_PORT: 5432,

  DATABASE_USER: 'darwindeploy',

  DATABASE_DB_NAME: 'darwindeploy',

  DATABASE_DB_PASS: '',

  MOOVE_URL: 'http://darwin-application:8080',

  DARWIN_NOTIFICATION_URL: 'http://darwin-deploy.darwin.svc.cluster.local:3000/notifications',

  DARWIN_UNDEPLOYMENT_CALLBACK: 'http://darwin-deploy.darwin.svc.cluster.local:3000/notifications/undeployment',

  DARWIN_DEPLOYMENT_CALLBACK: 'http://darwin-deploy.darwin.svc.cluster.local:3000/notifications/deployment',

  SPINNAKER_URL: 'http://spin-gate.spinnaker.svc.cluster.local:8084/',

  SPINNAKER_GITHUB_ACCOUNT: 'github-account',

  HELM_TEMPLATE_URL: 'https://api.github.com/repos/zupit/darwin-k8s-chart-values/contents/darwin-k8s-chart-values.tgz',

  HELM_PREFIX_URL: 'https://api.github.com/repos/zupit/darwin-k8s-chart-values/contents/',

  HELM_REPO_BRANCH: 'darwin-helm'
}
