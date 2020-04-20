import React, { useState } from 'react'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import ContentLayer from 'components/ContentLayer'
import GroupListLoader from 'containers/Groups/Loaders/GroupListLoader'
import ApplicationItem from 'containers/Workspaces/ApplicationItem'
import UserSVG from 'core/assets/svg/ic_group.svg'
import { Col } from 'components/Grid'
import AddCard from './AddCard'
import Styled from './styled'
import { getAvailableItems } from './helpers'

const Applications = ({ userApplications, allAplications, onAdd, loadingWorkspaces }) => {
  const [showSelectApplications, setShowSelectApplications] = useState(false)
  const availableGroups = getAvailableItems(allAplications, userApplications)

  const addApplication = (application) => {
    onAdd(application)
    setShowSelectApplications(false)
  }

  const renderApplications = () => (
    map(userApplications, ({ id, name, membersCount }, index) => (
      <ApplicationItem
        key={`${index}-${id}`}
        name={name}
        membersCount={membersCount}
      />
    ))
  )

  return (
    <ContentLayer icon={<UserSVG />}>
      <Styled.Title primary text="permissions.users.applications" />
      <Col xs="6">
        <Styled.Container>
          <AddCard
            onClick={() => setShowSelectApplications(true)}
            items={availableGroups}
            onAdd={application => addApplication(application)}
            showSelect={showSelectApplications}
          />
        </Styled.Container>
        { loadingWorkspaces ? <GroupListLoader /> : renderApplications() }
      </Col>
    </ContentLayer>
  )
}

Applications.defaultProps = {
  userApplications: [],
  allAplications: [],
}

Applications.propTypes = {
  userApplications: PropTypes.arrayOf(PropTypes.object),
  allAplications: PropTypes.arrayOf(PropTypes.object),
}

export default Applications
