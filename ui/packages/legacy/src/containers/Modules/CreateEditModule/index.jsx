import React, { useEffect } from 'react'
import { Title } from 'components'
import { useSelector } from 'core/state/hooks'
import { useRouter, useParams } from 'core/routing/hooks'
import { DASHBOARD_MODULES } from 'core/constants/routes'
import { getUserProfileData } from 'core/helpers/profile'
import Styled from './styled'
import useCreateEditModule from '../hooks/useCreateEditModule'
import Loader from '../Loaders/CreateEditLoader'
import useModules from '../hooks/useModules'
import Form from '../Form'
import { parseComponents } from '../helpers'

const CreateEditModule = () => {
  const router = useRouter()
  const { moduleId } = useParams()
  const [{ itemLoading, persistLoading }, { getModule, persistModule }] = useModules()
  const [{ configLoading }, { getConfig }] = useCreateEditModule()
  const { item, config } = useSelector(({ modules }) => modules)
  const isEditMode = router.history.location.pathname.includes('edit')

  useEffect(() => {
    if (!config) {
      getConfig()
    }

    if (moduleId) {
      getModule(moduleId)
    }
  }, [])

  const handleSubmit = async (values) => {
    const { name, gitRepositoryAddress, helmRepository } = values
    const { gitConfigurationId, registryConfigurationId, cdConfigurationId } = values
    const data = {
      name,
      gitRepositoryAddress,
      gitConfigurationId,
      registryConfigurationId,
      cdConfigurationId,
      components: parseComponents(values?.components),
      authorId: getUserProfileData('id'),
      helmRepository,
      labels: [],
    }

    await persistModule(moduleId, data)
  }

  return (
    <Styled.Wrapper>
      <Styled.Back onClick={() => router.push(DASHBOARD_MODULES)} />
      <Title primary text={isEditMode ? 'module.action.edit' : 'module.action.create'} />
      {itemLoading || configLoading ? <Loader /> : (
        <Form
          initialValues={{ params: item?.components || [{ name: '' }], ...item }}
          config={config}
          persistLoading={persistLoading}
          onSubmit={handleSubmit}
        />
      )}
    </Styled.Wrapper>
  )
}

export default CreateEditModule
