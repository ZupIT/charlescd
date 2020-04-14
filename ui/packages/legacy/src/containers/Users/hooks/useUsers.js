import { useState } from 'react'
import { useDispatch as userDispatchRedux } from 'react-redux'
import { toasterActions } from 'containers/Toaster/state/actions'
import { usersActions } from 'containers/Users/state'
import UsersAPI from 'core/api/users'
import { useDispatch, useSelector } from 'core/state/hooks'
import useGroups from 'containers/Groups/hooks/useGroups'

const useUsers = () => {
  const dispatchRedux = userDispatchRedux()
  const dispatch = useDispatch()
  const { list } = useSelector(({ users }) => users)
  const [usersLoading, setUsersLoading] = useState(false)
  const [userGroupLoading, setUserGroupLoading] = useState(false)
  const [userLoading, setUserLoading] = useState(false)
  const appendUsers = response => dispatch(usersActions.users({
    ...response,
    content: [...list.content, ...response.content],
  }))
  const [, { getGroups } ] = useGroups()

  const getUsers = () => {
    const page = 0
    setUsersLoading(true)

    return UsersAPI.findAll(page)
      .then(res => dispatch(usersActions.users(res)))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUsersLoading(false))

  }

  const getMoreUsers = () => {
    const incrementPage = 1
    const page = list?.page + incrementPage

    setUsersLoading(true)

    return UsersAPI.findAll(page)
      .then(appendUsers)
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUsersLoading(false))

  }

  const getUser = (id) => {
    setUserLoading(true)

    return UsersAPI.find(id)
      .then(res => dispatch(usersActions.user(res)))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUserLoading(false))

  }

  const getUserData = (email) => {
    setUserLoading(true)

    return UsersAPI.getUserByEmail(email)
      .then(res => dispatch(usersActions.user(res)))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUserLoading(false))
  }

  const getUserGroups = (id) => {
    setUserGroupLoading(true)

    return UsersAPI.getUserGroups(id)
      .then(({ groups }) => dispatch(usersActions.groups(groups)))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUserGroupLoading(false))
  }

  const createUser = (data) => {
    setUsersLoading(true)

    return UsersAPI.create(data)
      .then(getUsers)
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUserLoading(false))
  }

  const updateUser = (id, data) => {
    setUsersLoading(true)
    
    return UsersAPI.update(id, data)
      .then(getUsers)
      .then(() => getUser(btoa(data?.email)))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
      .finally(() => setUserLoading(false))
  }

  const addGroupToUser = (userId, groupIds) => {
    setUserGroupLoading(true)

    return UsersAPI.addUserToGroup(userId, { groupIds: [groupIds] })
      .then(() => getUserGroups(userId))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
  }

  const removeGroupFromUser = (id, groupId) => {
    setUserGroupLoading(true)

    return UsersAPI.removeUserFromGroup(id, groupId)
      .then(() => getUserGroups(id))
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
  }

  const addUserToGroup = (userId, groupIds) => {
    return UsersAPI.addUserToGroup(userId, { groupIds: [groupIds] })
      .then(() => getGroups())
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
  }

  const removeUserFromGroup = (id, groupId) => {
    return UsersAPI.removeUserFromGroup(id, groupId)
      .then(() => getGroups())
      .catch(() => dispatchRedux(toasterActions.toastFailed('message.error.unexpected')))
  }

  const state = {
    userLoading,
    usersLoading,
    userGroupLoading,
  }

  const actions = {
    getUsers,
    getUser,
    getMoreUsers,
    createUser,
    updateUser,
    getUserGroups,
    getUserData,
    addUserToGroup,
    removeUserFromGroup,
    addGroupToUser,
    removeGroupFromUser,
  }

  return [state, actions]
}

export default useUsers
