export const noRepeatedCircleDr = {
  apiVersion: 'networking.istio.io/v1beta1',
  kind: 'DestinationRule',
  metadata: {
    name: 'A',
    namespace: 'sandbox',
    annotations: {
      circles: '["default-circle-id","normal-circle-id"]'
    }
  },
  spec: {
    host: 'A',
    subsets: [
      {
        labels: {
          circleId: 'normal-circle-id',
          component: 'A',
          tag: 'v1'
        },
        name: 'normal-circle-id'
      },
      {
        labels: {
          circleId: 'default-circle-id',
          component: 'A',
          tag: 'v2'
        },
        name: 'default-circle-id'
      }
    ]
  }
}
