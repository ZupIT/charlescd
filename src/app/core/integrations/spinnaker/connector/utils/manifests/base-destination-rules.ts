import { IDeploymentVersion, IPipelineCircle } from '../../../../../../api/components/interfaces'
import { ISubset } from './base-service'

interface IDestinationRule {
  apiVersion: string
  kind: 'DestinationRule'
  metadata: {
    name: string
    namespace: string
  }
  spec: {
    host: string
    subsets: ISubset[]
  }
}

export interface IDestinationRuleParams {
  circles: IPipelineCircle[]
  appName: string
  appNamespace: string
  versions: IDeploymentVersion[]
}

const baseDestinationRules = (appName: string, appNamespace: string): IDestinationRule => ({
  apiVersion: 'networking.istio.io/v1alpha3',
  kind: 'DestinationRule',
  metadata: {
    name: appName,
    namespace: appNamespace
  },
  spec: {
    host: appName,
    subsets: []
  }
})

const createSubsets = (versions: IDeploymentVersion[], appName: string): ISubset[] => {
  return versions.map(({ version }) => ({
    labels: {
      version: `${appName}-${version}`
    },
    name: version
  }))
}

const createDestinationRules = (appName: string, appNamespace: string, circles: IPipelineCircle[], versions: IDeploymentVersion[]) => {
  const newDestinationRule = baseDestinationRules(appName, appNamespace)
  if (circles) {
    const subsetsToAdd = createSubsets(versions, appName)
    newDestinationRule.spec.subsets = subsetsToAdd
  }
  return newDestinationRule
}

export default createDestinationRules
