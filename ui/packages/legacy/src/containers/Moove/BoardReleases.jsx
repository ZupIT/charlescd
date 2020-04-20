import React, { Fragment } from 'react'
import map from 'lodash/map'
import Board from 'components/Board'
import BuildsColumn from 'containers/Moove/Columns/BuildsColumn'
import DeployedReleasesColumn from 'containers/Moove/Columns/DeployedReleasesColumn'
import { BOARD_COLUMN } from 'containers/Moove/constants'

const BoardReleases = (props) => {
  const { columns } = props

  const renderCurrentColumn = ({ cards, builds, ...rest }) => ({
    [BOARD_COLUMN.BUILDS]: <BuildsColumn {...rest} list={builds} />,
    [BOARD_COLUMN.DEPLOYED_RELEASES]: <DeployedReleasesColumn {...rest} list={builds} />,
  }[rest.name])

  return (
    <Fragment>
      <Board>
        { map(columns, (column => renderCurrentColumn({ ...column, key: column.id }))) }
      </Board>
    </Fragment>
  )
}

export default BoardReleases
