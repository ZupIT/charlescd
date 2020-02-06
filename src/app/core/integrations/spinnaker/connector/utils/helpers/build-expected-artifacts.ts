import { createPrimaryId } from './create-id-names'
import { HelmTypes } from './constants'

export interface IGithubConfig {
  helmTemplateUrl: string
  helmPrefixUrl: string
  helmRepoBranch: string
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

const buildExpectedArtifacts = (githubConfig: IGithubConfig, githubAccount: string,
                                appName: string, helmType: HelmTypes): IBuildArtifact => {
  const { helmTemplateUrl, helmPrefixUrl, helmRepoBranch } = githubConfig
  const fileJudge = helmType === 'template'
    ? helmTemplateUrl
    : `${helmPrefixUrl}${appName}.yaml`
  return {
    defaultArtifact: {
      artifactAccount: githubAccount,
      id: `${helmType}-${appName}-default-artifact`,
      name: `${helmType}-${appName}`,
      reference: fileJudge,
      type: 'github/file',
      version: helmRepoBranch || 'master'
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
