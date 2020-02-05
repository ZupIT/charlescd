const createProduceArtifact = (version, appName) => ({
  defaultArtifact: {
    customKind: true,
    id: `useless - deployment - ${version}`
  },
  displayName: `deployment - ${version}`,
  id: `deployment - ${version}`,
  matchArtifact: {
    id: `useless - deployment - ${version} - match`,
    name: appName,
    type: 'embedded/base64'
  },
  useDefaultArtifact: false,
  usePriorArtifact: false
})

export default createProduceArtifact
