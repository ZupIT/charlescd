import { AppConstants } from '../../../../../../app/v2/core/constants'

export const noRepeatedCircleDr = {
  apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
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
