import { COLORS } from 'core/assets/themes'

export const GITHUB_HOST = 'http://github.com'

export const BOARD_COLUMN = {
  TO_DO: 'To Do',
  DOING: 'Doing',
  READY_TO_GO: 'Ready to Go',
  BUILDS: 'Builds',
  DEPLOYED_RELEASES: 'Deployed Releases',
}

export const TYPES = {
  ACTION: 'ACTION',
  FEATURE: 'FEATURE',
}

export const RELEASE_TYPES = {
  BUILDING: 'BUILDING',
  MERGING: 'MERGING',
  BUILT: 'BUILT',
  DEPLOYING: 'DEPLOYING',
  UNDEPLOYING: 'UNDEPLOYING',
  DEPLOYED: 'DEPLOYED',
  BUILD_FAILED: 'BUILD_FAILED',
  DEPLOY_FAILED: 'DEPLOY_FAILED',
  NOT_DEPLOYED: 'NOT_DEPLOYED',
  VALIDATED: 'VALIDATED',
  DEPRECATED: 'DEPRECATED',
  DEFAULT: 'DEFAULT',
}

export const CARD_LIST_INFOS = {
  ACTION: { color: COLORS.COLOR_BLACK, id: TYPES.ACTION, name: 'moove.create.selectTypeAction' },
  FEATURE: { color: COLORS.COLOR_NAVY_BLUE, id: TYPES.FEATURE, name: 'moove.create.selectTypeFeature' },
}

export const LOADING_TYPES = {
  CREATE: 'create',
}
