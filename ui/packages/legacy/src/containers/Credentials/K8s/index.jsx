import React, { useState, useEffect } from 'react'
import { Title, Translate, Button, Toggle } from 'components'
import map from 'lodash/map'
import useStep from 'core/helpers/step'
import { useRouter } from 'core/routing/hooks'
import { FinalForm } from 'containers/FinalForm'
import { StyledConfig } from 'containers/Credentials/styled'
import { SETTINGS_CREDENTIALS } from 'core/constants/routes'
import { getUserProfileData } from 'core/helpers/profile'
import ConfigInput from '../components/ConfigInput'
import connectionK8sStream from '../stream/k8s'
import { tools, spinnakerType, octopipeType } from './constants'

const K8sConfig = ({ k8sStream }) => {
  const { store$, actions$ } = k8sStream
  const [selectedTool, setTool] = useState(octopipeType)
  const { step, stepHandler } = useStep(['name', 'account', 'namespace', 'finish'])
  const [payload, setPayload] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    store$.subscribe(k8s => setLoading(k8s.loading))
  }, [])

  const handlePayload = (key, value) => {
    setPayload({ ...payload, [key]: value })
    stepHandler.next()
  }

  const onSubmit = (values) => {
    actions$
      .saveK8s({
        ...values,
        type: selectedTool,
        authorId: getUserProfileData('id'),
      })
      .subscribe(() => router.push(SETTINGS_CREDENTIALS))
  }

  return (
    <StyledConfig.ModalContent
      onClose={() => router.push(SETTINGS_CREDENTIALS)}
    >
      <Title primary text="credentials.title.k8s" />

      <Translate id="credentials.k8s.chooseCD" />
      <StyledConfig.ToggleList>
        {map(tools, tool => (
          <Toggle
            key={tool.id}
            name={tool.name}
            selected={tool.id === selectedTool}
            onClick={() => setTool(tool.id)}
          />
        ))}
      </StyledConfig.ToggleList>
      
      <FinalForm
        initialValues={{}}
        onSubmit={onSubmit}
        destroyOnUnregister={true}
      >
        {() => (
          <>
            <StyledConfig.Step step={step.name}>
              <StyledConfig.Input
                name="name"
                label="credentials.k8s.label.name"
                properties={{ autoComplete: 'off' }}
                validate="required"
              />
            </StyledConfig.Step>
            {selectedTool === spinnakerType ? (
              <StyledConfig.Step step={step.name}>
                <StyledConfig.Input
                  name="configurationData.account"
                  label="credentials.k8s.account"
                  properties={{ autoComplete: 'off' }}
                  validate="required"
                />
              </StyledConfig.Step>
            ) : (
              <>
                <StyledConfig.Step step={step.name}>
                  <StyledConfig.Input
                    name="configurationData.gitUsername"
                    label="credentials.k8s.label.username"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                </StyledConfig.Step>
                <StyledConfig.Step step={step.name}>
                  <StyledConfig.Input
                    name="configurationData.gitPassword"
                    type="password"
                    label="credentials.k8s.label.password"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                </StyledConfig.Step>
              </>
            )}
            
            <StyledConfig.Step step={step.name}>
              <StyledConfig.Input
                name="configurationData.namespace"
                label="credentials.k8s.label.namespace"
                properties={{ autoComplete: 'off' }}
                validate="required"
              />
            </StyledConfig.Step>
            <Button type="submit">
              <Translate id="general.finish" />
            </Button>
          </>
        )}
      </FinalForm>
    </StyledConfig.ModalContent>
  )
}

export default connectionK8sStream(K8sConfig)
