const newCDConfiuration = {
  name: 'CD Confiuration',
  type: 'SPINNAKER',
  configurationData: {
    namespace: 'CD Config Namespace',
    url: 'http://github.com',
    gitAccount: 'charsleszup',
    account: 'charsleszup',
    gitProvider: 'Github',
    gitToken: '',
    provider: 'EKS',
    clientCertificate: 'charles-client',
    clientKey: '',
    caData: '',
    awsSID: '',
    awsSecret: '',
    awsRegion: 'br-east-1',
    awsClusterName: 'Cluster'
  }
};

export default {
  newCDConfiuration
};
