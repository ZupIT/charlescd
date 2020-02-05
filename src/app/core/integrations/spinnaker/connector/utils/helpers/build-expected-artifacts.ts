import { createPrimaryId } from './create-id-names'
interface IGithubConfig {
  helmTemplateUrl: string
  helmPrefixUrl: string
  helmRepoBranch: string
}
const buildExpectedArtifacts = (
  githubConfig: IGithubConfig,
  githubAccount: string,
  appName: string,
  helmType: 'template' | 'value'
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
