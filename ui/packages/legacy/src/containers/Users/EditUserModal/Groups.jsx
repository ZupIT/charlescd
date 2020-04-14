import React, { useState } from 'react'
import map from 'lodash/map'
import { useParams } from 'core/routing/hooks'
import { injectIntl } from 'react-intl'
import ContentLayer from 'components/ContentLayer'
import GroupListLoader from 'containers/Groups/Loaders/GroupListLoader'
import GroupItem from 'containers/Groups/GroupItem'
import UserSVG from 'core/assets/svg/ic_group.svg'
import { Col } from 'components/Grid'
import AddCard from './AddCard'
import Styled from './styled'
import { getAvailableItems } from './helpers'

const Groups = ({
  userGroupLoading,
  userGroups,
  groups,
  removeGroupFromUser,
  addGroupToUser,
}) => {
  const { id } = useParams()
  const [showSelectGroups, setShowSelectGroups] = useState(false)
  const deleteGroup = groupId => removeGroupFromUser(id, groupId)
  const availableGroups = getAvailableItems(groups, userGroups)

  const addGroup = (selectGroup) => {
    addGroupToUser(id, selectGroup)
    setShowSelectGroups(false)
  }

  const renderGroupItem = ({ id: groupId, name, roles }) => (
    <GroupItem
      key={name}
      name={name}
      roles={roles}
      options={
        [{ label: 'permissions.group.delete', action: () => deleteGroup(groupId) }]
      }
    />
  )

  return (
    <ContentLayer icon={<UserSVG />}>
      <Styled.Title primary text="permissions.users.groups" />
      <Col xs="6">
        <Styled.Container>
          <AddCard
            onClick={() => setShowSelectGroups(true)}
            items={availableGroups}
            onAdd={selectGroup => addGroup(selectGroup)}
            showSelect={showSelectGroups}
          />
        </Styled.Container>
        { userGroupLoading ? <GroupListLoader /> : map(userGroups, renderGroupItem) }
      </Col>
    </ContentLayer>
  )
}

export default injectIntl(Groups)
