import React, { useEffect } from 'react'
import useGroups from 'containers/Groups/hooks/useGroups'
import { useRouter, useParams } from 'core/routing/hooks'
import { useWorkspace } from 'containers/Workspaces/hooks/workspaces'
import { useSelector } from 'core/state/hooks'
import useUsers from '../hooks/useUsers'
import Styled from '../styled'
import UserForm from './UserForm'
import Applications from './Applications'
import Groups from './Groups'
import { getWorkspaceUsers } from './helpers'

const EditUserModal = () => {
  const history = useRouter()
  const { id, email } = useParams()
  const [{ userGroupLoading }, usersActions] = useUsers()
  const {
    getUserGroups, addGroupToUser, removeGroupFromUser, getUserData, updateUser,
  } = usersActions
  const [{ loadingAddMembers }, workspaceActions] = useWorkspace()
  const { getWorkspaces, addMembers, setLoadingAddMembers } = workspaceActions
  const { list: allAplications } = useSelector(({ workspaces }) => workspaces)
  const { item: user, groups: userGroups } = useSelector(({ users }) => users)
  const { list: groups } = useSelector(state => state?.groups)
  const [{ groupsLoading }, { getGroups }] = useGroups()

  useEffect(() => {
    getUserData(atob(email))
    getUserGroups(id)
    getGroups()
    getWorkspaces()
  }, [])

  const onSaveUser = (userData) => {
    updateUser(user.id, userData)
  }

  const onAddApplication = async (applicationId) => {
    const usersFromWorkspace = getWorkspaceUsers(applicationId, allAplications)

    setLoadingAddMembers(true)
    await addMembers(applicationId, [user, ...usersFromWorkspace])
    await getUserData(atob(email))
    setLoadingAddMembers(false)
  }

  return (
    <Styled.Modal onClose={() => history.goBack()} size="large">
      <Styled.Form onSubmit={e => e.preventDefault()}>
        <UserForm user={user} onSave={onSaveUser} />
        <Applications
          userApplications={user?.applications}
          allAplications={allAplications}
          onAdd={onAddApplication}
          loadingWorkspaces={loadingAddMembers}
        />
        <Groups
          groupsLoading={groupsLoading}
          userGroupLoading={userGroupLoading}
          userGroups={userGroups}
          groups={groups}
          removeGroupFromUser={removeGroupFromUser}
          addGroupToUser={addGroupToUser}
        />
      </Styled.Form>
    </Styled.Modal>
  )
}

export default EditUserModal
