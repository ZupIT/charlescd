import { ISpinnakerGithubConfig } from '../../../interfaces/spinnaker-pipeline-github-account.interface'
import { HelmTypes } from './constants'
import { createPrimaryId } from './create-id-names'
import { IBuildArtifact } from '../../interfaces'

const buildExpectedArtifacts = (helmRepository: string, githubAccount: string,
                                appName: string, helmType: HelmTypes): IBuildArtifact => {
  const fileJudge = helmType === 'template'
    ? `${helmRepository}${appName}/${appName}-darwin.tgz`
    : `${helmRepository}${appName}/${appName}.yaml`
  return {
    defaultArtifact: {
      artifactAccount: githubAccount,
      id: `${helmType}-${appName}-default-artifact`,
      name: `${helmType}-${appName}`,
      reference: fileJudge,
      type: 'github/file',
      version: 'master'
    },
    displayName: helmType,
    id: createPrimaryId(helmType, appName),
    matchArtifact: {
      artifactAccount: 'github-artifact',
      id: `useless-${helmType}`,
      name: `${helmType}-${appName}`,
      type: 'github/file'
    },
    useDefaultArtifact: true,
    usePriorArtifact: false
  }
}

export default buildExpectedArtifacts
