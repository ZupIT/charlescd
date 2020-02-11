import { IPipelineCircle } from '../../../../../api/components/interfaces'
import { DefaultCircleId } from '../../../../constants/application/configuration.constants'

export type HttpMatcherUnion = ICircleRegexMatcher | ICircleHttpMatcher | IDefaultCircleMatcher

export interface HttpMatchersParams {
  circles: IPipelineCircle[]
  appName: string
  uri: { uriName: string }
}

export interface VirtualServiceParams {
  appName: string
  appNamespace: string
}

export interface IBaseVirtualService {
  apiVersion: string
  kind: string
  metadata: {
    name: string
    namespace: string
  }
  spec: {
    hosts: string[]
    http: HttpMatcherUnion[]
  }
}

export interface IDefaultCircleMatcher {
  route: [
    {
      destination: {
        host: string
        subset: string
      },
      headers: {
        request: {
          set: {
            'x-circle-source': DefaultCircleId
          }
        }
      }
    }
  ]
}

export interface ICircleHttpMatcher {
  match: [
    {
      headers: {
        [key: string]: {
          exact: string
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: string
        subset: string
      },
      headers: {
        request: {
          set: {
            'x-circle-source': string
          }
        }
      }
    }
  ]
}

export interface ICircleRegexMatcher {
  match: [
    {
      headers: {
        cookie: {
          regex: string
        }
      }
    }
  ],
  route: [
    {
      destination: {
        host: string
        subset: string
      },
      headers: {
        request: {
          set: {
            'x-circle-source': string
          }
        }
      }
    }
  ]
}
