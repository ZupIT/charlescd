import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import get from 'lodash/get'
import find from 'lodash/find'
import { DropdownMenu } from 'components'
import { RELEASE_TYPES } from 'containers/Moove/constants'
import { mooveActions } from 'containers/Moove/state/actions'
import InfoSVG from 'core/assets/svg/info.svg'
import { Styled } from './styled'

const DraggableRelease = (props) => {
  const dispatch = useDispatch()
  const { id, index, features, status, tag } = props
  const { BUILDING, DEFAULT, BUILD_FAILED } = RELEASE_TYPES
  const [open, toggleOpen] = useState(false)

  const renderBadge = statusBadge => <Styled.Card.Badge status={statusBadge} />

  const ifActions = () => status !== BUILDING

  const deleteBuild = () => dispatch(mooveActions.deleteBuild(id))

  const archiveBuild = () => dispatch(mooveActions.archiveBuild(id))

  const mapStatus = releaseStatus => ({
    BUILDING: { icon: <Styled.Release.Loading />, message: tag, badge: renderBadge('BUILDING') },
    BUILD_FAILED: {
      icon: <Styled.Release.BuildFailed />,
      message: tag,
      badge: renderBadge(status),
    },
    DEFAULT: { icon: <InfoSVG />, message: tag, badge: renderBadge(status) },
  }[releaseStatus])

  const verifyStatus = () => {
    const { status: releaseStatus } = find([
      { condition: status === BUILDING, status: BUILDING },
      { condition: status === BUILD_FAILED, status: BUILD_FAILED },
      { condition: true, status: DEFAULT },
    ], ({ condition }) => condition)

    return releaseStatus
  }

  const renderExpandedAction = () => (
    <Styled.Card.ActionContent display={open}>
      <Styled.Card.Action onClick={() => toggleOpen(!open)} />
    </Styled.Card.ActionContent>
  )

  const renderExpandedContent = () => (
    <Styled.Card.ExpandedContent display={open}>
      { map(features, ({ id: featureId, name }) => (
        <Styled.Card.ExpandedItem key={featureId}>
          { name }
        </Styled.Card.ExpandedItem>
      ))}
    </Styled.Card.ExpandedContent>
  )

  const renderHeader = () => (
    <Styled.Release.Header>
      <Styled.Release.HeaderItem>
        <Styled.Release.HeaderAction
          onClick={() => toggleOpen(!open)}
        >
          { get(mapStatus(verifyStatus()), 'icon') }
          { get(mapStatus(verifyStatus()), 'badge') }
        </Styled.Release.HeaderAction>

        { ifActions() && (
          <DropdownMenu
            dark
            options={[
              { label: 'general.archive', action: archiveBuild },
              { label: 'general.remove', action: deleteBuild },
            ]}
          />
        )}
      </Styled.Release.HeaderItem>

      <div
        onClick={() => toggleOpen(!open)}
      >
        { get(mapStatus(verifyStatus()), 'message') }
      </div>
    </Styled.Release.Header>
  )

  return (
    <Styled.Release.Wrapper
      buildStatus={status}
      id={id}
      index={index}
    >
      { renderHeader() }
      { renderExpandedContent() }
      { renderExpandedAction() }
    </Styled.Release.Wrapper>
  )
}

DraggableRelease.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  features: PropTypes.array.isRequired,
  tag: PropTypes.string.isRequired,
}

export default DraggableRelease
