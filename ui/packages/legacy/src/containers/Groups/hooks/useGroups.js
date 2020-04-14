import { useState, useEffect } from 'react'
import AuthInfo from 'core/api/auth-info'
import { useDispatch } from 'core/state/hooks'
import { groupsActions } from '../state'

const useGroups = () => {
  const dispatch = useDispatch()
  const [newGroup, setNewGroup] = useState()
  const [groupsLoading, setGroupsLoading] = useState(false)
  const [groupLoading, setGroupLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    return () => dispatch(groupsActions.reset('item'))
  }, [])

  const getGroups = () => {
    setGroupsLoading(true)

    AuthInfo.getGroups()
      .then(res => dispatch(groupsActions.groups(res)))
      .catch(console.error)
      .finally(() => setGroupsLoading(false))
  }

  const getGroup = (id) => {
    setGroupLoading(true)

    return AuthInfo.getGroup(id)
      .then(res => dispatch(groupsActions.group(res)))
      .catch(error => console.log(error))
      .finally(() => setGroupLoading(false))
  }

  const createGroup = data => (
    AuthInfo.createGroup(data)
      .then(res => setNewGroup(res))
      .then(getGroups)
      .catch(error => console.error(error))
      .finally(() => setCreateLoading(false))
  )

  const editGroup = (id, data) => {
    setEditLoading(true)

    AuthInfo.editGroup(id, data)
      .then(getGroups)
      .catch(error => console.error(error))
      .finally(() => setEditLoading(false))
  }

  const deleteGroup = (id) => {
    setGroupsLoading(true)

    AuthInfo.deleteGroup(id)
      .then(getGroups)
      .catch(error => console.error(error))
  }

  const state = {
    newGroup,
    groupsLoading,
    groupLoading,
    createLoading,
    editLoading,
  }

  const actions = {
    getGroups,
    getGroup,
    createGroup,
    editGroup,
    deleteGroup,
    setGroupLoading,
  }

  return [state, actions]
}

export default useGroups
