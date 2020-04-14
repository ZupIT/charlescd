import { COLORS } from 'core/assets/themes'
import find from 'lodash/find'
import get from 'lodash/get'
import some from 'lodash/some'
import { RELEASE_TYPES, TYPES, BOARD_COLUMN } from 'containers/Moove/constants'

export function columnsInfos(name) {
  const COLUMN_TYPES = {
    CARD: 'CARD_TYPE',
    RELEASE: 'RELEASE_TYPE',
  }

  return {
    [BOARD_COLUMN.TO_DO]: { title: 'moove.column.todo', color: COLORS.COLOR_BLURPLE, type: COLUMN_TYPES.CARD },
    [BOARD_COLUMN.DOING]: { title: 'moove.column.doing', color: COLORS.COLOR_MOON_YELLOW, type: COLUMN_TYPES.CARD },
    [BOARD_COLUMN.READY_TO_GO]: { title: 'moove.column.readyToGo', color: COLORS.COLOR_CARIBBEAN_GREEN, type: COLUMN_TYPES.CARD },
    [BOARD_COLUMN.BUILDS]: { title: 'moove.column.builds', color: COLORS.COLOR_CINNABAR, type: COLUMN_TYPES.CARD },
    [BOARD_COLUMN.DEPLOYED_RELEASES]: { title: 'moove.column.deployedReleases', color: COLORS.COLOR_BLURPLE, type: COLUMN_TYPES.RELEASE },
  }[name]
}

const isReleaseBuildingOrDeploying = ({ status, deployments }) => {
  const [deploy] = deployments || []

  return status === RELEASE_TYPES.BUILDING || deploy ?.status === RELEASE_TYPES.DEPLOYING
}

export const isSameColumn = (destinationColumnId, sourceColumnId) => {
  return destinationColumnId === sourceColumnId
}

export function isBuildOrDeployingRelease(list) {
  const TEAM_VALIDATION = 'team_validation'
  const teamValidationColumn = find(list, ({ name }) => name === TEAM_VALIDATION)
  const teamValidationBuilds = get(teamValidationColumn, 'builds')

  return some(teamValidationBuilds, isReleaseBuildingOrDeploying)
}

export const isDescriptionRender = (type, branchName) => {
  return (type === TYPES.FEATURE && branchName) || type === TYPES.ACTION
}

export const generateReleaseName = () => `release-darwin-${new Date().getTime()}`
