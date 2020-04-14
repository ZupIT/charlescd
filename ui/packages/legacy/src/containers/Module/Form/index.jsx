import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FinalForm } from 'containers/FinalForm'
import Resume from 'containers/Resume'
import useStep from 'core/helpers/step'
import { useRouter, useParams } from 'core/routing/hooks'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import find from 'lodash/find'
import { Translate, Title, ModalFullContent } from 'components'
import { Button, THEME } from 'components/Button'
import connectionConfigStream from 'containers/Credentials/stream/config'
import { getUserProfileData } from 'core/helpers/profile'
import combineStreams from 'core/helpers/combineStreams'
import { DASHBOARD_MODULES } from 'core/constants/routes'
import { FormLoader } from '../Loaders'
import connectionModuleStream from '../stream/module'
import { StyledModule } from '../styled'
import ModuleComponent from './ModuleComponent'
import { ConfigToggle } from '../../Credentials/components'

const ModuleForm = (props) => {
  const { configStream, moduleStream } = props
  const { moduleId } = useParams()
  const authorId = getUserProfileData('id')
  const [configs, setConfigs] = useState(configStream.store$.getValue())
  const [payload, setPayload] = useState({})
  const [component, setComponent] = useState({})
  const [addComponent, setAddComponent] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const initialStep = moduleId ? 'finish' : 'name'
  const { step, stepHandler } = useStep(['name', 'gitAddress', 'git', 'registry', 'k8s', 'components', 'finish'], initialStep)
  const router = useRouter()

  useEffect(() => {
    configStream.actions$.getConfigs()
    configStream.store$.subscribe(setConfigs)
    moduleStream.actions$.getModule(moduleId)
    moduleStream.store$.subscribe((module) => {
      setLoading(module.loading)
      setPayload(module.module)
    })

  }, [])

  const handlePayload = (field, value, resumeFn, to) => {
    setPayload({ ...payload, [field]: value })
    resumeFn && resumeFn()
    stepHandler.go(to)
  }

  const handleComponents = (isEditMode, comp, resumeFn) => {
    const radix = 10
    const components = payload.components || []
    const formatted = { ...comp, port: parseInt(comp.port, radix) }
    const newComponents = isEditMode
      ? map(components, com => (com.name === component.name) ? formatted : com)
      : components.concat(formatted)

    setEditMode(isEditMode)
    setAddComponent(false)
    stepHandler.go('finish')
    resumeFn && resumeFn()

    return setPayload({ ...payload, components: newComponents })
  }

  const handleComponent = (isEditMode, tagSelected) => {
    if (isEditMode) {
      const { components } = payload
      const currentComponent = find(components, ({ name }) => name === tagSelected) || {}
      setComponent(currentComponent)
    }
    setEditMode(isEditMode)
  }

  const getComponentsTags = () => {
    const components = payload.components || []

    return map(components, ({ name }) => name)
  }

  const getConfigTag = (config, field) => {
    const { name } = find(configs[config], item => item.id === payload[field]) || { name: '' }

    return name
  }

  const onSubmit = () => {
    const moduleAction$ = moduleStream.actions$
    const data = { ...payload, authorId, labels: [] }
    const service$ = moduleId
      ? moduleAction$.updateModule(moduleId, data)
      : moduleAction$.saveModule(data)

    service$.subscribe(() => router.push(DASHBOARD_MODULES))
  }

  const renderContent = () => (
    <ModalFullContent onClose={() => router.push(DASHBOARD_MODULES)}>
      <Title primary text="module.action.create" />
      <StyledModule.Step step={step.name}>
        <Resume initial={!isEmpty(payload.name)} name="module.form.module" tags={[payload.name]}>
          {resumeFn => (
            <FinalForm
              initialValues={{ name: payload.name }}
              onSubmit={({ name }) => handlePayload('name', name, resumeFn, 'gitAddress')}
            >
              {() => (
                <StyledModule.Form>
                  <StyledModule.Input name="name" label="module.form.label" properties={{ autoComplete: 'off' }} validate="required" />
                  <Button type="submit" margin="0 15px">
                    <Translate id="general.ok" />
                  </Button>
                </StyledModule.Form>
              )}
            </FinalForm>
          )}
        </Resume>
      </StyledModule.Step>
      <StyledModule.Step step={step.gitAddress}>
        <Resume initial={!isEmpty(payload.gitRepositoryAddress)} name="module.form.git.address" tags={[payload.gitRepositoryAddress]}>
          {resumeFn => (
            <FinalForm
              initialValues={{ gitRepositoryAddress: payload.gitRepositoryAddress }}
              onSubmit={({ gitRepositoryAddress }) => handlePayload('gitRepositoryAddress', gitRepositoryAddress, resumeFn, 'git')}
            >
              {() => (
                <StyledModule.Form>
                  <StyledModule.Input
                    name="gitRepositoryAddress"
                    label="module.form.git.address.label"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                  <Button type="submit" margin="0 15px">
                    <Translate id="general.ok" />
                  </Button>
                </StyledModule.Form>
              )}
            </FinalForm>
          )}
        </Resume>
      </StyledModule.Step>
      <StyledModule.Step step={step.git}>
        <ConfigToggle
          label="module.form.git.choose"
          field="gitConfigurationId"
          resumeName="module.form.git"
          selected={payload.gitConfigurationId}
          items={configs.git || []}
          tag={getConfigTag('git', 'gitConfigurationId')}
          valueFrom="id"
          onSelect={(field, value) => handlePayload(field, value, null, 'registry')}
        />
      </StyledModule.Step>
      <StyledModule.Step step={step.registry}>
        <ConfigToggle
          label="module.form.registry.choose"
          field="registryConfigurationId"
          resumeName="module.form.registry"
          selected={payload.registryConfigurationId}
          items={configs.registry || []}
          tag={getConfigTag('registry', 'registryConfigurationId')}
          valueFrom="id"
          onSelect={(field, value) => handlePayload(field, value, null, 'k8s')}
        />
      </StyledModule.Step>
      <StyledModule.Step step={step.k8s}>
        <ConfigToggle
          label="module.form.k8s.choose"
          field="cdConfigurationId"
          resumeName="module.form.k8s"
          selected={payload.cdConfigurationId}
          items={configs.k8s || []}
          tag={getConfigTag('k8s', 'cdConfigurationId')}
          valueFrom="id"
          onSelect={(field, value) => handlePayload(field, value, null, 'components')}
        />
      </StyledModule.Step>
      <StyledModule.Step step={step.components}>
        <Resume
          initial={!isEmpty(payload.components)}
          name="module.form.components"
          tags={getComponentsTags()}
          onChange={handleComponent}
        >
          {resumeFn => (
            <ModuleComponent
              component={component}
              onSubmit={(isEditMode, comp) => handleComponents(isEditMode, comp, resumeFn)}
            />
          )}
        </Resume>
      </StyledModule.Step>
      <StyledModule.Step step={step.finish}>
        { addComponent && (
          <ModuleComponent
            onCancel={() => setAddComponent(false)}
            onSubmit={(isEditMode, comp) => handleComponents(isEditMode, comp, null)}
          />
        )}
      </StyledModule.Step>
      <StyledModule.Step step={step.finish}>
        { (!addComponent && !editMode) && (
          <StyledModule.Flex>
            <Button theme={THEME.OUTLINE} onClick={() => setAddComponent(true)}>
              <Translate id="module.form.addComponent" />
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              margin="0 15px"
              isLoading={loading}
              properties={{ disabled: loading }}
            >
              <Translate id="general.finish" />
            </Button>
          </StyledModule.Flex>
        )}
      </StyledModule.Step>
    </ModalFullContent>
  )

  return loading ? <FormLoader /> : renderContent()
}

ModuleForm.propTypes = {
  configStream: PropTypes.object.isRequired,
  moduleStream: PropTypes.object.isRequired,
}

export default combineStreams(
  connectionConfigStream,
  connectionModuleStream,
)(ModuleForm)
