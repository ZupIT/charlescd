export const noRepeatedUndeploymentDefaultCircleDr = {
  apiVersion: 'networking.istio.io/v1beta1',
  kind: 'DestinationRule',
  metadata: {
    name: 'A',
    namespace: 'sandbox',
    annotations: {
      circles: '["normal-circle-id"]'
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
      }
    ]
  }
}
