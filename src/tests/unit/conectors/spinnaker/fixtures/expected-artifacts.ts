const expectedArtifact = {
  defaultArtifact: {
    artifactAccount: 'github-account',
    id: 'template-app-name-default-artifact',
    name: 'template-app-name',
    reference: 'helm.template.url',
    type: 'github/file',
    version: 'branch-name'
  },
  displayName: 'template',
  id: 'template - app-name',
  matchArtifact: {
    artifactAccount: 'github-artifact',
    id: 'useless-template',
    name: 'template-app-name',
    type: 'github/file'
  },
  useDefaultArtifact: true,
  usePriorArtifact: false
}

export default expectedArtifact
