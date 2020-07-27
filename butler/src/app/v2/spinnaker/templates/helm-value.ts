import { ExpectedArtifact } from '../../interfaces/spinnaker-pipeline.interface'
import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'
import { CdConfiguration, Component } from '../../interfaces'

export const getHelmValueObject = (component: Component, configuration: CdConfiguration): ExpectedArtifact => ({
  defaultArtifact: {
    artifactAccount: (configuration.configurationData as ISpinnakerConfigurationData).gitAccount,
    id: `value-${component.name}-default-artifact`,
    name: `value-${component.name}`,
    reference: `${component.helmUrl}/${component.name}/${component.name}.yaml`,
    type: 'github/file',
    version: 'master'
  },
  displayName: 'value',
  id: `value - ${component.name}`,
  matchArtifact: {
    artifactAccount: 'github-artifact',
    id: 'useless-value',
    name: `value-${component.name}`,
    type: 'github/file'
  },
  useDefaultArtifact: true,
  usePriorArtifact: false
})