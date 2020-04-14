import React, { useEffect } from 'react'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { IconButton } from 'components/IconButton'
import Translate from 'components/Translate'
import Plus from 'core/assets/svg/plus.svg'
import { getPath } from 'core/helpers/routes'
import {
  SETTINGS_PERMISSIONS_GROUPS_CREATE,
  SETTINGS_PERMISSIONS_GROUPS_EDIT,
} from 'core/constants/routes'
import { useRouter } from 'core/routing/hooks'
import { useSelector } from 'core/state/hooks'
import GroupListLoader from './Loaders/GroupListLoader'
import GroupItem from './GroupItem'
import useGroups from './hooks/useGroups'
import Styled from './styled'

const Groups = ({ children }) => {
  const history = useRouter()
  const { list } = useSelector(({ groups }) => groups)
  const [{ groupsLoading }, { getGroups, deleteGroup }] = useGroups()

  useEffect(() => {
    if (isEmpty(list)) {
      getGroups()
    }
  }, [])

  const handleDeleteGroup = id => deleteGroup(id)

  const renderGroups = () => (
    map(list, ({ id, name, roles, membersCount }) => (
      <GroupItem
        key={id}
        name={name}
        roles={roles}
        membersCount={membersCount}
        options={
          [{ label: 'permissions.group.delete', action: () => handleDeleteGroup(id) }]
        }
        onGroupClick={() => history.push(getPath(SETTINGS_PERMISSIONS_GROUPS_EDIT, [id]))}
      />
    ))
  )


  return (
    <Styled.Wrapper>
      <IconButton
        icon={<Plus />}
        onClick={() => history.push(SETTINGS_PERMISSIONS_GROUPS_CREATE)}
      >
        <Translate id="permissions.group.button.create" />
      </IconButton>

      { groupsLoading ? <GroupListLoader /> : renderGroups() }

      {children}
    </Styled.Wrapper>
  )
}

export default Groups
