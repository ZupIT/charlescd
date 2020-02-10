const expectedBaseVirtualService = {
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'VirtualService',
  metadata: {
    name: 'app-name',
    namespace: 'app-namespace'
  },
  spec: {
    hosts: [
      'app-name'
    ],
    http: [
      {
        match: [
          {
            headers: {
              cookie: {
                regex: '.*x-circle-id=header-value.*'
              }
            }
          }
        ],
        route: [
          {
            destination: {
              host: 'app-name',
              subset: 'v3'
            }
          }
        ]
      },
      {
        match: [
          {
            headers: {
              'header-name': {
                exact: 'header-value'
              }
            }
          }
        ],
        route: [
          {
            destination: {
              host: 'app-name',
              subset: 'v3'
            }
          }
        ]
      }
    ]
  }
}

export default expectedBaseVirtualService
