export interface ICreateProduceArtifact {
  defaultArtifact: {
    customKind: boolean
    id: string
  }
  displayName: string
  id: string
  matchArtifact: {
    id: string
    name: string
    type: 'embedded/base64'
  }
  useDefaultArtifact: boolean
  usePriorArtifact: boolean
}

const createProduceArtifact = (version: string, appName: string): ICreateProduceArtifact => ({
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
