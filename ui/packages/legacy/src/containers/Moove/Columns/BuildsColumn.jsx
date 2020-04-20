import React from 'react'
import map from 'lodash/map'
import { useDispatch } from 'react-redux'
import { useRouter, useParams } from 'core/routing/hooks'
import { DropdownMenu } from 'components'
import { CardRelease } from 'core/components'
import InfoOutlinedSVG from 'core/assets/svg/info-outlined.svg'
import { mooveActions } from 'containers/Moove/state/actions'
import { RELEASE_TYPES } from 'containers/Moove/constants'
import { DASHBOARD_HYPOTHESES_CARD_BUILDS } from 'core/constants/routes'
import ColumnHeader from './ColumnHeader'
import ColumnContent from './ContentColumn'
import Styled from './styled'

const BuildsColumn = ({ id, name, list }) => {
  const dispatch = useDispatch()
  const history = useRouter()
  const { hypothesisId } = useParams()
  const isNotBuilding = status => status !== RELEASE_TYPES.BUILDING

  const renderRelease = item => (
    <CardRelease
      id={id}
      key={item?.id}
      icon={<InfoOutlinedSVG />}
      status={item?.status}
      onClick={() => history.push(DASHBOARD_HYPOTHESES_CARD_BUILDS, hypothesisId, item?.id)}
      body={item?.tag}
      content={item?.features}
      action={(
        isNotBuilding(item?.status) && (
          <DropdownMenu
            dark
            options={[
              { label: 'general.archive', action: () => dispatch(mooveActions.archiveBuild(item?.id)) },
              { label: 'general.remove', action: () => dispatch(mooveActions.deleteBuild(item?.id)) },
            ]}
          />
        )
      )}
    />
  )

  const renderReleases = () => map(list, item => renderRelease(item))

  return (
    <Styled.Wrapper>
      <ColumnHeader id={name} />
      <ColumnContent
        id={id}
        type={name}
      >
        { renderReleases() }
      </ColumnContent>
    </Styled.Wrapper>
  )
}

export default BuildsColumn
