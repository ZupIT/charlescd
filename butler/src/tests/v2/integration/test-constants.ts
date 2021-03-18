export const UrlConstants = {
  deploymentCallbackUrl: process.env['DARWIN_DEPLOYMENT_CALLBACK'] || 'http://bad:8883/deploy/notifications/deployment',
  helmRepository: process.env['FAKE_HELM_URL'] || 'http://localhost:8883/repos/charlescd-fake/helm-chart/contents?ref=master'
}
