import { K8sManifest } from '../../interfaces/k8s-manifest.interface'
import {
  IEKSClusterConfig,
  IGenericClusterConfig
} from '../../../../../v1/core/integrations/octopipe/interfaces/octopipe-payload.interface'

export interface HelmRepositoryConfig {
  type: string
  url: string
  token: string
}

export interface HelmOverrideValues {
  'image.tag': string
  deploymentName: string
  component: string
  tag: string
  circleId: string
}

export interface HelmConfig {
  overrideValues: HelmOverrideValues
}

export interface Deployment {
  componentName: string
  helmRepositoryConfig: HelmRepositoryConfig
  helmConfig: HelmConfig
  rollbackIfFailed: boolean
}

export interface OctopipeDeployment {
  namespace: string;
  deployments: Deployment[]
  proxyDeployments: K8sManifest[]
  callbackUrl: string
  clusterConfig?: IEKSClusterConfig | IGenericClusterConfig | null
}
