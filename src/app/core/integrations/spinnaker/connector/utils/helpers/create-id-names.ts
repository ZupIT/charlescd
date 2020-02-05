import { HelmTypes } from './constants'

const createPrimaryId = (helmType: HelmTypes, version: string): string => `${helmType} - ${version}`

const createBakeStage = (version: string): string => `Bake ${version}`

export {
  createPrimaryId,
  createBakeStage
}
