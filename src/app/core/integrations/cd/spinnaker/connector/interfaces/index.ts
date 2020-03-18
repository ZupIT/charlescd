import { IPipelineCircle } from '../../../../../../api/components/interfaces'
import { DefaultCircleId } from '../../../../../constants/application/configuration.constants'
import { HelmTypes } from '../utils/helpers/constants'
import { IBaseStage } from '../utils/base-default-stage'
import { IBaseHelmStage } from '../utils/base-stage-helm'
import { IBaseDeployment } from '../utils/manifests/base-deployment'
import { IBaseDelete } from '../utils/manifests/base-delete-deployment'
import { IBaseWebhook } from '../utils/base-webhook'

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

export interface IEmptyVirtualService {
  apiVersion: string
  kind: string
  metadata: {
    name: string
    namespace: string
  }
  spec: {
    hosts: ['unreachable-app-name']
    http: [
      {
        match: [
          {
            headers: {
              'unreachable-cookie-name': {
                'exact': 'unreachable-cookie - value'
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

interface ICircleRoute {
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

export interface ICircleHttpMatcher extends ICircleRoute {
  match: [
    {
      headers: {
        [key: string]: {
          exact: string
        }
      }
    }
  ]
}

export interface ICircleRegexMatcher extends ICircleRoute {
  match: [
    {
      headers: {
        cookie: {
          regex: string
        }
      }
    }
  ]
}

interface ISpinnakerTrigger {
  enabled: boolean
  payloadConstraints: object
  source: string
  type: string
}

export interface IBuildArtifact {
  defaultArtifact: {
    artifactAccount: string
    id: string
    name: string
    reference: string
    type: string
    version: string
  },
  displayName: HelmTypes
  id: string
  matchArtifact: {
    artifactAccount: string
    id: string
    name: string
    type: string
  }

  useDefaultArtifact: boolean
  usePriorArtifact: boolean
}

export interface IStageEnabled {
  expression: string | string[]
}

export type BaseStagesUnion = Array<IBaseStage | IBaseHelmStage | IBaseDeployment | IBaseDelete | IBaseWebhook>

export interface IBaseSpinnakerPipeline {
  appConfig: object
  application: string
  name: string
  expectedArtifacts: IBuildArtifact[]
  keepWaitingPipelines: boolean
  lastModifiedBy: string
  limitConcurrent: boolean
  stages: BaseStagesUnion
  triggers: ISpinnakerTrigger[]
  updateTs: string
}

export interface IBuildService {
  stages: BaseStagesUnion
  refId: number
  previousStages: string[]
}

export interface IBuildReturn {
  stages: BaseStagesUnion
  refId: number
  previousStage: string
}

export interface IDeploymentReturn {
  stages: BaseStagesUnion
  deploymentsIds: string[]
  refId: number
  previousStage: string
  previousStages: string[]
}

export interface ICleanIds {
  refId: number
  previousStage: string
  deploymentsIds: string[]
}
