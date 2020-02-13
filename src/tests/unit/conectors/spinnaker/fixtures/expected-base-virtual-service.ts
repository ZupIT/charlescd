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
            },
            headers: {
              request: {
                set: {
                  'x-circle-source': 'header-value',
                },
              },
            },
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
            },
            headers: {
              request: {
                set: {
                  'x-circle-source': 'header-value',
                },
              },
            },
          }
        ]
      }
    ]
  }
}

export default expectedBaseVirtualService
