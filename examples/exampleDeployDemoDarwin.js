const { CreateSpinnakerPipeline } = require('../dist/spinnaker')
const axios = require('axios')

const auth = '914c22322bf4c53f1111176fbcfa6e9ad24f31ca'

const contractTeste = {
  account: 'k8s-account',
  pipelineName: 'darwinDemoPipeline',
  applicationName: 'testelucas',
  appName: 'webhook',
  appNamespace: 'qa',
  imgUri: 'lukascaska/node-darwin',
  webhookUri: 'http://104.155.183.168/disney',
  healthCheckPath: '/webhook/health',
  appPort: '3000',
  envVariables: [
    {
      envName: 'SPRING_CLOUD_CONSUL_HOST',
      envValue: 'consul-server'
    },
    {
      envName: 'SPRING_CLOUD_CONSUL_ENABLED',
      envValue: "'true'"
    },
    {
      envName: 'SPRING_CLOUD_CONSUL_CONFIG_ENABLED',
      envValue: "'true'"
    },
    {
      envName: 'SPRING_CLOUD_INETUTILS_IGNORED_INTERFACES',
      envValue: 'lo'
    },
    {
      envName: 'ENV',
      envValue: 'qa'
    }
  ],
  subsets: [
    {
      version: 'v1',
      versionTag: ':v1'
    }
  ],
  hosts: [
    {
      hostName: 'teste.zup.me'
    }
  ],
  circle: [
    {
      headers: [
        {
          headerName: 'x-circle',
          headerValue: 'circle-2'
        }
      ],
      uri: [
        {
          uriName: '/darwindemo'
        }
      ],
      destination: [
        {
          version: 'v1'
        }
      ]
    }
  ],
  metricTitle: 'teste-de-metrica',
  metrics: [
    {
      metricName: 'teste update',
      metricTag: 'update_client_vivo'
    }
  ]
}

Promise.resolve(CreateSpinnakerPipeline(auth, 'lucassaleszup', 'templates-charts', 'demoApp', contractTeste)).then((value) => {
  const options = {
    method: 'POST',
    url: 'https://darwin-spinnaker-gate.continuousplatform.com/pipelines',
    data: value,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  }
  axios(options).then((deubom) => {
    const options = {
      method: 'POST',
      url: `https://darwin-spinnaker-gate.continuousplatform.com/webhooks/webhook/${contractTeste.appName}`,
      data: {},
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    }
    axios(options).then((r) => console.log(r))
  })
})
