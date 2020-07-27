import { ISpinnakerConfigurationData } from '../../../v1/api/configurations/interfaces'
import { CdConfiguration, Component } from '../../interfaces'
import { ExpectedArtifact } from '../../interfaces/spinnaker-pipeline.interface'

export const getHelmTemplateObject = (component: Component, configuration: CdConfiguration): ExpectedArtifact => ({
  defaultArtifact: {
    artifactAccount: (configuration.configurationData as ISpinnakerConfigurationData).gitAccount,
    id: `template-${component.name}-default-artifact`,
    name: `template-${component.name}`,
    reference: `${component.helmUrl}/${component.name}/${component.name}-darwin.tgz`,
    type: 'github/file',
    version: 'master'
  },
  displayName: 'template',
  id: `template - ${component.name}`,
  matchArtifact: {
    artifactAccount: 'github-artifact',
    id: 'useless-template',
    name: `template-${component.name}`,
    type: 'github/file'
  },
  useDefaultArtifact: true,
  usePriorArtifact: false
})
