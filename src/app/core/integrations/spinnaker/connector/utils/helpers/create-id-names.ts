const createPrimaryId = (helmType, version) => `${helmType} - ${version}`

const createBakeStage = (version) => `Bake ${version}`

export {
  createPrimaryId,
  createBakeStage
}
