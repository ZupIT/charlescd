export const noRepeatedUndeploymentCircleDr = {
  apiVersion: 'networking.istio.io/v1beta1',
  kind: 'DestinationRule',
  metadata: {
    name: 'A',
    namespace: 'sandbox',
    annotations: {
      circles: '["default-circle-id"]'
    }
  },
  spec: {
    host: 'A',
    subsets: [
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
