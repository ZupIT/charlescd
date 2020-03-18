import { IPipelineVersion } from '../../../../../../../api/components/interfaces'
import { ISpinnakerPipelineConfiguration } from '../../../interfaces'
import { ISpinnakerBaseService, ISubset } from './base-service'

interface RulesAppConfig {
  appName: string
  appNamespace: string
}

interface SubsetParams {
  versions: IPipelineVersion[]
  appName: string
}

const baseDestinationRules = ({ appName, appNamespace }: RulesAppConfig): ISpinnakerBaseService => ({
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

const createSubsets = ({ versions, appName }: SubsetParams): ISubset[] => {
  return versions.map(({ version }) => ({
    labels: {
      version: `${appName}-${version}`
    },
    name: version
  }))
}

const createDestinationRules = (contract: ISpinnakerPipelineConfiguration) => {
  const newDestinationRule = baseDestinationRules(contract)
  if (contract.circles) {
    const subsetsToAdd = createSubsets(contract)
    newDestinationRule.spec.subsets = subsetsToAdd
  }
  return newDestinationRule
}

export default createDestinationRules
