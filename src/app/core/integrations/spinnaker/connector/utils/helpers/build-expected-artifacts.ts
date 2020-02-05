import { createPrimaryId } from './create-id-names'

const buildExpectedArtifacts = (
  githubConfig,
  githubAccount,
  appName,
  helmType
) => {
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
