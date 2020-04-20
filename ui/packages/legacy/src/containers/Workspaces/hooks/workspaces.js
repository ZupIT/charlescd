import { useState } from 'react'
import map from 'lodash/map'
import applicationAPI from 'core/api/application'
import { toasterActions } from 'containers/Toaster/state/actions'
import { useDispatch as useDispatchRedux } from 'react-redux'
import { useDispatch } from 'core/state/hooks'
import { workspacesActions } from 'containers/Workspaces/state'
import { getUserProfileData } from 'core/helpers/profile'

export const useWorkspace = () => {
  const authorId = getUserProfileData('id')
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false)
  const [loadingWorkspace, setLoadingWorkspace] = useState(false)
  const [loadingAddMembers, setLoadingAddMembers] = useState(false)
  const [workspace, setWorkspace] = useState({})
  const dispatch = useDispatch()
  const dispatchRedux = useDispatchRedux()

  const getWorkspaces = async () => {
    try {
      setLoadingWorkspaces(true)
      const response = await applicationAPI.findAll()
      dispatch(workspacesActions.workspaces(response.content))

      return response

    } catch (e) {
      dispatchRedux(toasterActions.toastFailed(e.message))

      return e
    } finally {
      setLoadingWorkspaces(false)
    }
  }

  const getWorkspace = async (applicationId) => {
    try {
      setLoadingWorkspace(true)
      const response = await applicationAPI.findById(applicationId)
      setWorkspace(response)

    } catch (e) {
      dispatchRedux(toasterActions.toastFailed(e.message))
    } finally {
      setLoadingWorkspace(false)
    }
  }

  const saveWorkspace = async ({ name }) => {
    try {
      const response = await applicationAPI.create({ name, authorId })
      dispatch(workspacesActions.updateWorkspaces(response))

      return response
    } catch (e) {
      dispatchRedux(toasterActions.toastFailed(e.message))

      return Promise.reject(e)
    }
  }

  const updateWorkspace = async (applicationId, data) => {
    try {
      await applicationAPI.update(applicationId, data)
      dispatch(workspacesActions.updateWorkspaces({
        id: applicationId,
        name: data.name,
      }))
    } catch (e) {
      dispatch(toasterActions.toastFailed(e.message))
    }
  }

  const addMembers = async (applicationId, users, backup) => {
    try {
      const memberIds = map(users, ({ id }) => id)
      const payload = { memberIds, authorId }

      setWorkspace({ ...workspace, users })
      await applicationAPI.addMember(applicationId, payload)
      await getWorkspaces()

    } catch (e) {
      setWorkspace({ ...workspace, users: backup })
      dispatch(toasterActions.toastFailed(e.message))
    }
  }

  return [
    {
      loadingWorkspaces,
      loadingWorkspace,
      workspace,
      loadingAddMembers,
    },
    {
      getWorkspaces,
      getWorkspace,
      updateWorkspace,
      saveWorkspace,
      addMembers,
      setLoadingAddMembers,
    },
  ]
}
