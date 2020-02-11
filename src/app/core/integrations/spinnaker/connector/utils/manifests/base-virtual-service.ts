import { IPipelineCircle } from '../../../../../../api/components/interfaces'
import { ConfigurationConstants, DefaultCircleId } from '../../../../../constants/application/configuration.constants'
import { ISpinnakerPipelineConfiguration } from '../../../interfaces'
import {
  HttpMatchersParams,
  HttpMatcherUnion,
  IBaseVirtualService,
  ICircleHttpMatcher,
  ICircleRegexMatcher,
  IDefaultCircleMatcher,
  VirtualServiceParams
} from '../../interfaces'

const baseVirtualService = ({ appName, appNamespace }: VirtualServiceParams): IBaseVirtualService => ({
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

const createXCircleIdHttpMatcher = (circle: IPipelineCircle, appName: string): ICircleHttpMatcher | undefined => {
  if (circle.header) {
    return {
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
          },
          headers: {
            request: {
              set: {
                'x-circle-source': circle.header.headerValue
              }
            }
          }
        }
      ]
    }
  }
}

const createRegexHttpMatcher = (circle: IPipelineCircle, appName: string): ICircleRegexMatcher | undefined => {
  if (circle.header) {
    return {
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
          },
          headers: {
            request: {
              set: {
                'x-circle-source': circle.header.headerValue
              }
            }
          }
        }
      ]
    }
  }
}

const createDefaultCircleHttpMatcher = (circle: IPipelineCircle, appName: string): IDefaultCircleMatcher => ({
  route: [
    {
      destination: {
        host: appName,
        subset: circle.destination.version
      },
      headers: {
        request: {
          set: {
            'x-circle-source': ConfigurationConstants.DEFAULT_CIRCLE_ID as DefaultCircleId
          }
        }
      }
    }
  ]
})

const createHttpMatchers = ({ circles, appName, uri }: HttpMatchersParams): HttpMatcherUnion[] => {
  return circles.reduce((acc: HttpMatcherUnion[], circle) => {
    if (circle.header) {
      pushRegexHttpMatcher(circle, appName, acc)
      pushCircleIdHttpMatcher(circle, appName, acc)
      return acc
    }
    acc.push(createDefaultCircleHttpMatcher(circle, appName))
    return acc
  }, [])
}

const pushRegexHttpMatcher = (circle: IPipelineCircle, appName: string, matcherList: HttpMatcherUnion[]) => {
  const regexMatcher = createRegexHttpMatcher(circle, appName)
  if (regexMatcher) {
    matcherList.push(regexMatcher)
  }
}

const pushCircleIdHttpMatcher = (circle: IPipelineCircle, appName: string, matcherList: HttpMatcherUnion[]) => {
  const httpMatcher = createXCircleIdHttpMatcher(circle, appName)
  if (httpMatcher) {
    matcherList.push(httpMatcher)
  }
}

const createVirtualService = (contract: ISpinnakerPipelineConfiguration) => {
  const newVirtualService = baseVirtualService(contract)
  const matchers = createHttpMatchers(contract)
  if (contract.hosts) {
    newVirtualService.spec.hosts = contract.hosts
  }
  newVirtualService.spec.http = matchers
  return newVirtualService
}

export default createVirtualService
