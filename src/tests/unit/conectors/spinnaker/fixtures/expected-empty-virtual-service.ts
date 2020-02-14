const expectedEmptyVirtualService = {
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'VirtualService',
  metadata: {
    name: 'app-name',
    namespace: 'app-namespace'
  },
  spec: {
    hosts: [
      'unreachable-app-name'
    ],
    http: [
      {
        match: [
          {
            headers: {
              'unreachable-cookie-name': {
                exact: 'unreachable-cookie - value'
              }
            }
          }
        ],
        route: [
          {
            destination: {
              host: 'unreachable-app-name'
            }
          }
        ]
      }
    ]
  }
}

export default expectedEmptyVirtualService
