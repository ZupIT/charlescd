const expectedArtifactTemplate = {
  defaultArtifact: {
    artifactAccount: 'github-account',
    id: 'template-app-name-default-artifact',
    name: 'template-app-name',
    reference: 'https://api.github.com/repos/org/repo/contents/app-name/app-name-darwin.tgz',
    type: 'github/file',
    version: 'master'
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

export default expectedArtifactTemplate
