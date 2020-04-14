import React, { useState } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import find from 'lodash/find'
import map from 'lodash/map'
import { RELEASE_TYPES } from 'containers/Moove/constants'
import { DropdownMenu } from 'components'
import { ifActions, getModulesByFeatures } from './helpers'
import Styled from './styled'

const Release = (props) => {
  const { className, tag, status, deployment, features, actions } = props
  const { DEPLOYING, BUILDING, DEFAULT, BUILD_FAILED, DEPLOYED, UNDEPLOYING } = RELEASE_TYPES
  const [open, toggleOpen] = useState(false)

  const verifyStatus = () => {
    const { status: releaseStatus } = find([
      { condition: deployment.status === DEPLOYING, status: DEPLOYING },
      { condition: deployment.status === UNDEPLOYING, status: UNDEPLOYING },
      { condition: deployment.status === DEPLOYED, status: DEPLOYED },
      { condition: status === BUILDING, status: BUILDING },
      { condition: status === BUILD_FAILED, status: BUILD_FAILED },
      { condition: true, status: DEFAULT },
    ], ({ condition }) => condition)

    return releaseStatus
  }

  const renderBadge = statusBadge => <Styled.Card.Badge status={statusBadge} />

  const mapStatus = releaseStatus => ({
    DEPLOYING: { icon: <Styled.Release.Loading />, message: tag, badge: renderBadge(DEPLOYING) },
    BUILDING: { icon: <Styled.Release.Loading />, message: tag, badge: renderBadge(BUILDING) },
    UNDEPLOYING: {
      icon: <Styled.Release.Loading />, message: tag, badge: renderBadge(UNDEPLOYING),
    },
    BUILD_FAILED: {
      icon: <Styled.Release.BuildFailed />, message: tag, badge: renderBadge(status),
    },
    DEPLOYED: { icon: <Styled.Release.InfoIcon />, message: tag, badge: renderBadge(DEPLOYED) },
    DEFAULT: { icon: <Styled.Release.InfoIcon />, message: tag, badge: renderBadge(status) },
  }[releaseStatus])

  const renderHeader = () => (
    <Styled.Release.Header.Wrapper>
      <Styled.Release.Header.Item>
        <Styled.Release.Header.Action>
          {get(mapStatus(verifyStatus()), 'icon')}
          {get(mapStatus(verifyStatus()), 'badge')}
        </Styled.Release.Header.Action>

        {ifActions(actions, deployment) && (
          <DropdownMenu
            dark
            options={actions}
          />
        )}
      </Styled.Release.Header.Item>
      <Styled.Release.Header.Title onClick={() => toggleOpen(!open)}>
        {get(mapStatus(verifyStatus()), 'message')}
      </Styled.Release.Header.Title>
    </Styled.Release.Header.Wrapper>
  )

  const renderExpandedContent = () => (
    <Styled.Card.ExpandedContent display={open}>
      {map(getModulesByFeatures(features), ({ id: featureId, name }) => (
        <Styled.Card.ExpandedItem key={featureId}>
          <Styled.Release.GitIcon /> {name}
        </Styled.Card.ExpandedItem>
      ))}
      <Styled.Card.Border onClick={() => toggleOpen(!open)} />
    </Styled.Card.ExpandedContent>
  )

  return (
    <Styled.Release.Card
      className={className}
      buildStatus={status}
      deploymentStatus={deployment.status}
    >
      {renderHeader()}
      {renderExpandedContent()}
    </Styled.Release.Card>
  )
}

Release.defaultProps = {
  tag: '',
  status: '',
  features: [],
  deployment: {},
  actions: [],
}

Release.propTypes = {
  tag: PropTypes.string,
  status: PropTypes.string,
  features: PropTypes.array,
  deployment: PropTypes.object,
  actions: PropTypes.array,
}

export default Release
