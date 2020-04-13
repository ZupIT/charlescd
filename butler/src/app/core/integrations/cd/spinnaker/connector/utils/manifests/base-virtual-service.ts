import { IPipelineCircle } from '../../../../../../../api/components/interfaces'
import { ConfigurationConstants, DefaultCircleId } from '../../../../../../constants/application/configuration.constants'
import { ISpinnakerPipelineConfiguration } from '../../../interfaces'
import {
  HttpMatcherUnion,
  IBaseVirtualService,
  ICircleHttpMatcher,
  ICircleRegexMatcher,
  IDefaultCircleMatcher,
  IEmptyVirtualService
} from '../../interfaces'

const baseVirtualService = (appName: string, appNamespace: string): IBaseVirtualService => ({
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

const baseEmptyVirtualService = (appName: string, appNamespace: string): IEmptyVirtualService => ({
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'VirtualService',
  metadata: {
    name: appName,
    namespace: appNamespace
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

const createHttpMatchers = (circles: IPipelineCircle[], appName: string, uri: string): HttpMatcherUnion[] => {
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

export const createVirtualService = (appName: string, appNamespace: string, circles: IPipelineCircle[], uri: string, hosts: string[]) => {
  const newVirtualService = baseVirtualService(appName, appNamespace)
  const matchers = createHttpMatchers(circles, appName, uri)
  if (hosts) {
    newVirtualService.spec.hosts = hosts
  }
  newVirtualService.spec.http = matchers
  return newVirtualService
}

export const createEmptyVirtualService = (appName: string, appNamespace: string): IEmptyVirtualService => {
  const newVirtualService: IEmptyVirtualService = baseEmptyVirtualService(appName, appNamespace)
  return newVirtualService
}
