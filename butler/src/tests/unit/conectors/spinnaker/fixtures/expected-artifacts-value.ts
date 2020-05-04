const expectedArtifactValue = {
  defaultArtifact: {
    artifactAccount: 'github-account',
    id: 'value-app-name-default-artifact',
    name: 'value-app-name',
    reference: 'https://api.github.com/repos/org/repo/contents/app-name/app-name.yaml',
    type: 'github/file',
    version: 'master'
  },
  displayName: 'value',
  id: 'value - app-name',
  matchArtifact: {
    artifactAccount: 'github-artifact',
    id: 'useless-value',
    name: 'value-app-name',
    type: 'github/file'
  },
  useDefaultArtifact: true,
  usePriorArtifact: false
}

export default expectedArtifactValue
