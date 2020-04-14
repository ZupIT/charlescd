import { useState } from 'react'
import ConfigAPI from 'core/api/config'
import { useDispatch } from 'core/state/hooks'
import { modulesActions } from '../state'

const useCreateEditModule = () => {
  const dispatch = useDispatch()
  const [configLoading, setConfigLoading] = useState(false)

  const getConfig = () => {
    setConfigLoading(true)
    
    const gitConfig = ConfigAPI.getGitConfig()
    const configs = ConfigAPI.getConfigs()
    
    return Promise.all([gitConfig, configs])
      .then(data => {
        const { git, ...withoutgit } = data[1]
        const { content } = data[0]
        const finalData = {
          git: content,
          ...withoutgit
        }
        dispatch(modulesActions.config(finalData))
      })
      .then(() => setConfigLoading(false))
  }

  return [{ configLoading }, { getConfig }]
}

export default useCreateEditModule
