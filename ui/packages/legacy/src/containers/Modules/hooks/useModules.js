import { useState, useEffect } from 'react'
import { useDispatch as useDispatchRedux } from 'react-redux'
import ModulesAPI from 'core/api/modules'
import { useDispatch } from 'core/state/hooks'
import { useRouter } from 'core/routing/hooks'
import { DASHBOARD_MODULES } from 'core/constants/routes'
import { toasterActions } from 'containers/Toaster/state/actions'
import { modulesActions } from '../state'

const useModules = () => {
  const dispatch = useDispatch()
  const dispatchRedux = useDispatchRedux()
  const router = useRouter()
  const [listLoading, setListLoading] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const [persistLoading, setPersistLoading] = useState(false)

  useEffect(() => {
    return () => dispatch(modulesActions.reset('item'))
  }, [])

  const getModules = () => {
    setListLoading(true)

    ModulesAPI.getModules()
      .then(response => dispatch(modulesActions.modules(response)))
      .then(() => setListLoading(false))
      .catch(error => dispatchRedux(toasterActions.toastFailed(error)))
  }

  const getModule = (id) => {
    setItemLoading(true)

    ModulesAPI.getModule(id)
      .then(response => dispatch(modulesActions.module(response)))
      .then(() => setItemLoading(false))
      .catch(error => dispatchRedux(toasterActions.toastFailed(error)))
  }

  const persistModule = (id, data) => {
    setPersistLoading(true)

    if (id) {
      ModulesAPI.updateModule(id, data)
        .then(() => getModules())
        .then(() => setPersistLoading(false))
        .then(() => router.push(DASHBOARD_MODULES))
        .catch(error => dispatchRedux(toasterActions.toastFailed(error)))
        .finally(() => setPersistLoading(false))
    } else {
      ModulesAPI.saveModule(data)
        .then(() => getModules())
        .then(() => setPersistLoading(false))
        .then(() => router.push(DASHBOARD_MODULES))
        .catch(error => dispatchRedux(toasterActions.toastFailed(error.message)))
        .finally(() => setPersistLoading(false))
    }
  }

  const deleteModule = (id) => {
    ModulesAPI.deleteModule(id)
      .then(response => dispatch(modulesActions.modules(response)))
      .then(() => setPersistLoading(false))
      .catch(error => dispatchRedux(toasterActions.toastFailed(error.message)))
  }

  return [
    { listLoading, itemLoading, persistLoading },
    { getModules, getModule, persistModule, deleteModule },
  ]
}

export default useModules
