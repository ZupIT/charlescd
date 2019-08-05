const { CreateSpinnakerPipeline } = require('../dist/spinnaker')
const axios = require('axios')

const auth = '914c22322bf4c53f1111176fbcfa6e9ad24f31ca'

const contractTeste = {
  account: 'k8s-account',
  pipelineName: 'webhookpipeline',
  applicationName: 'testelucas',
  appName: 'webhook',
  appNamespace: 'qa',
  imgUri: 'lukascaska/node-darwin',
  webhookUri: 'http://104.155.183.168/disney',
  appPort: '3000',
  subsets: [
    {
      version: 'default',
      versionTag: ':webhookv1'
    }
  ],
  circle: [
    {
      uri: [
        {
          uriName: '/disney'
        }
      ],
      destination: [
        {
          version: 'default'
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
  axios(options).then((pipelineName) => {
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
