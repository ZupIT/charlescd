import { IPipelineCircle } from '../../../../../../api/components/interfaces'
import ISpinnakerContract from '../../types/contract'

interface VirtualServiceParams {
  appName: string
  appNamespace: string
}
const baseVirtualService = ({ appName, appNamespace }: VirtualServiceParams) => ({
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'VirtualService',
  metadata: {
    name: appName,
    namespace: appNamespace
  },
  spec: {
    hosts: [appName],
    http: []
  }
})

const createXCircleIdHttpMatcher = (circle: IPipelineCircle, appName: string) => ({
  match: [
    {
      headers: {
        [circle.header.headerName]: {
          exact: circle.header.headerValue
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      }
    }
  ]
})

const createRegexHttpMatcher = (circle: IPipelineCircle, appName: string) => ({
  match: [
    {
      headers: {
        cookie: {
          regex: `.*x-circle-id=${circle.header.headerValue}.*`
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      }
    }
  ]
})

const createOpenSeaHttpMatcher = (circle: IPipelineCircle, appName: string) => ({
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      }
    }
  ]
})

interface HttpMatchersParams {
  circles: IPipelineCircle[]
  appName: string
  uri: { uriName: string}
}
const createHttpMatchers = ({ circles, appName, uri }: HttpMatchersParams) => {
  return circles.reduce((acc: any, circle) => {
    if (circle.header) {
      acc.push(createRegexHttpMatcher(circle, appName))
      acc.push(createXCircleIdHttpMatcher(circle, appName))
      return acc
    }
    acc.push(createOpenSeaHttpMatcher(circle, appName))
    return acc
  }, [])
}

const createVirtualService = (contract: ISpinnakerContract) => {
  const newVirtualService = baseVirtualService(contract)
  const matchers = createHttpMatchers(contract)
  if (contract.hosts) {
    newVirtualService.spec.hosts = contract.hosts
  }
  newVirtualService.spec.http = matchers
  return newVirtualService
}

export default createVirtualService
