// https://gist.github.com/lucassaleszup/71cc8f144c66c0a027c2ecf21ae8d72d

module.exports = {
  account: 'conta k8s',
  appName: 'nome da aplicação que será deployada',
  applicationName: 'nome da aplicação do Spinnaker',
  pipelineName: 'nome da pipeline',
  appNamespace: 'namespace que deverá ser usado',
  imgUri: 'uri base do docker registry do módulo',
  webhookUri: 'Uri que servirá para o spinnaker avisar que terminou o deploy',
  appPort: 'porta da aplicação',
  subsets: [
    {
      version: 'versão do deployment',
      versionTag: 'tag da versão no docker'
    }
  ],
  hosts: [
    {
      hostName: 'host que poderá acessar esse deploy'
    }
  ],
  circle: [
    {
      headers: [
        {
          headerName: 'nome do header que será usado para router',
          headerValue: 'qual o valor esperado para o header'
        }
      ],
      uri: [
        {
          uriName: 'ponto de entrada do contexto da aplicação'
        }
      ],
      destination: [
        {
          version: 'qual das versões presentes em subsets esse circle deverá acessar'
        }
      ]
    }
  ]
}
