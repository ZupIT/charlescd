import { AppConstants } from '../../../../../../app/v2/core/constants'

export const noRepeatedUndeploymentCircleDr = {
  apiVersion: AppConstants.ISTIO_RESOURCES_API_VERSION,
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
